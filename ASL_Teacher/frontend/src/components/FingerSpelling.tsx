import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import styles from './FingerSpelling.module.css';

// ASL Alphabet - currently trained on A, B, C
const ALPHABET = ['A', 'B', 'C'];
const IMAGE_SIZE = 128; // Model expects 128x128 images
const PREDICTION_INTERVAL = 500; // Make prediction every 500ms

interface Prediction {
  letter: string;
  confidence: number;
}

export function FingerSpelling() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [predictionHistory, setPredictionHistory] = useState<string[]>([]);
  const [spelledWord, setSpelledWord] = useState<string>('');
  const predictionIntervalRef = useRef<number | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const lastHandLandmarksRef = useRef<any>(null);

  // Load pre-trained CNN model
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('Loading model from /models/asl_alphabet/model.json...');
        const loadedModel = await tf.loadLayersModel('/models/asl_alphabet/model.json');
        setModel(loadedModel);
        setIsModelLoaded(true);
        console.log('✅ ASL CNN model loaded successfully');
      } catch (error) {
        console.error('❌ Error loading model:', error);
        alert(`Failed to load model. Check console for details.\nError: ${error}`);
      }
    };
    loadModel();
  }, []);

  // Initialize MediaPipe Hands and webcam
  useEffect(() => {
    const startCamera = async () => {
      if (!videoRef.current) return;

      try {
        // Initialize MediaPipe Hands
        const hands = new Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          }
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        hands.onResults((results) => {
          // Store the latest hand landmarks
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            lastHandLandmarksRef.current = results;
          } else {
            lastHandLandmarksRef.current = null;
          }
        });

        handsRef.current = hands;

        // Start camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' }
        });
        
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);

        // Start MediaPipe camera processing
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (handsRef.current && videoRef.current) {
              await handsRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });
        camera.start();

      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      
      if (predictionIntervalRef.current) {
        clearInterval(predictionIntervalRef.current);
      }

      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, []);

  // Preprocess video frame for model using MediaPipe hand detection
  const preprocessImage = (): tf.Tensor | null => {
    if (!videoRef.current || !canvasRef.current || !lastHandLandmarksRef.current) return null;

    const video = videoRef.current;
    const results = lastHandLandmarksRef.current;
    
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      return null;
    }

    const landmarks = results.multiHandLandmarks[0];
    
    // Find bounding box of hand landmarks
    let minX = 1, minY = 1, maxX = 0, maxY = 0;
    for (const landmark of landmarks) {
      minX = Math.min(minX, landmark.x);
      minY = Math.min(minY, landmark.y);
      maxX = Math.max(maxX, landmark.x);
      maxY = Math.max(maxY, landmark.y);
    }

    // Add padding (20% on each side)
    const width = maxX - minX;
    const height = maxY - minY;
    const padding = 0.2;
    minX = Math.max(0, minX - width * padding);
    minY = Math.max(0, minY - height * padding);
    maxX = Math.min(1, maxX + width * padding);
    maxY = Math.min(1, maxY + height * padding);

    // Convert normalized coordinates to pixel coordinates
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const x = minX * videoWidth;
    const y = minY * videoHeight;
    const w = (maxX - minX) * videoWidth;
    const h = (maxY - minY) * videoHeight;

    // Create temporary canvas to crop hand region
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = IMAGE_SIZE;
    tempCanvas.height = IMAGE_SIZE;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return null;

    // Draw cropped and resized hand region
    ctx.drawImage(video, x, y, w, h, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

    let tensor = tf.browser.fromPixels(tempCanvas)
      .toFloat()
      .div(255.0)
      .expandDims(0);
    
    return tensor;
  };

  // Make prediction from current video frame
  const makePrediction = async () => {
    if (!model || !videoRef.current || videoRef.current.readyState !== 4) return;

    try {
      const inputTensor = preprocessImage();
      if (!inputTensor) return;

      const output = model.predict(inputTensor) as tf.Tensor;
      const predictions = await output.data();
      
      // Debug: Log all prediction probabilities
      console.log('Raw predictions:', {
        A: predictions[0].toFixed(4),
        B: predictions[1].toFixed(4),
        C: predictions[2].toFixed(4)
      });
      
      const maxIndex = Array.from(predictions).indexOf(Math.max(...predictions));
      const maxConfidence = predictions[maxIndex];
      
      if (maxConfidence > 0.7) {
        const currentPrediction: Prediction = {
          letter: ALPHABET[maxIndex],
          confidence: maxConfidence
        };
        
        setPrediction(currentPrediction);
        
        setPredictionHistory(prev => {
          const newHistory = [...prev, currentPrediction.letter];
          if (newHistory.length > 10) newHistory.shift();
          
          const lastThree = newHistory.slice(-3);
          const allSame = lastThree.every(l => l === currentPrediction.letter);
          
          if (allSame && !spelledWord.endsWith(currentPrediction.letter)) {
            setSpelledWord(w => w + currentPrediction.letter);
          }
          
          return newHistory;
        });
      } else {
        setPrediction(null);
      }
      
      inputTensor.dispose();
      output.dispose();
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  };

  // Start prediction loop
  useEffect(() => {
    if (model && cameraActive && !predictionIntervalRef.current) {
      predictionIntervalRef.current = window.setInterval(() => {
        makePrediction();
      }, PREDICTION_INTERVAL);
    }

    return () => {
      if (predictionIntervalRef.current) {
        clearInterval(predictionIntervalRef.current);
        predictionIntervalRef.current = null;
      }
    };
  }, [model, cameraActive, spelledWord]);

  // Draw video to canvas with MediaPipe hand landmarks
  useEffect(() => {
    if (!cameraActive || !videoRef.current || !canvasRef.current) return;

    const drawFrame = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx || !videoRef.current || videoRef.current.readyState !== 4) {
        requestAnimationFrame(drawFrame);
        return;
      }

      const canvas = canvasRef.current!;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Draw hand landmarks if available
      if (lastHandLandmarksRef.current?.multiHandLandmarks) {
        const landmarks = lastHandLandmarksRef.current.multiHandLandmarks[0];
        
        // Draw connections between landmarks
        const connections = [
          [0,1],[1,2],[2,3],[3,4], // Thumb
          [0,5],[5,6],[6,7],[7,8], // Index
          [0,9],[9,10],[10,11],[11,12], // Middle
          [0,13],[13,14],[14,15],[15,16], // Ring
          [0,17],[17,18],[18,19],[19,20], // Pinky
          [5,9],[9,13],[13,17] // Palm
        ];

        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        
        for (const [start, end] of connections) {
          const startPoint = landmarks[start];
          const endPoint = landmarks[end];
          ctx.beginPath();
          ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height);
          ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height);
          ctx.stroke();
        }

        // Draw landmark points
        ctx.fillStyle = '#FF0000';
        for (const landmark of landmarks) {
          ctx.beginPath();
          ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 3, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      requestAnimationFrame(drawFrame);
    };

    drawFrame();
  }, [cameraActive]);

  const clearWord = () => {
    setSpelledWord('');
    setPredictionHistory([]);
  };

  const addSpace = () => {
    setSpelledWord(w => w + ' ');
  };

  const deleteLastLetter = () => {
    setSpelledWord(w => w.slice(0, -1));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>ASL Fingerspelling Recognition</h2>
        <div className={styles.status}>
          <span className={isModelLoaded ? styles.statusGood : styles.statusWarning}>
            {isModelLoaded ? '✓ CNN Model Loaded (99.4%)' : '⚠ Loading...'}
          </span>
          <span className={cameraActive ? styles.statusGood : styles.statusBad}>
            {cameraActive ? '✓ Camera Active' : '✗ Camera Inactive'}
          </span>
        </div>
      </div>

      <div className={styles.videoContainer}>
        <video ref={videoRef} className={styles.video} style={{ display: 'none' }} />
        <canvas ref={canvasRef} className={styles.canvas} width={640} height={480} />
        
        {prediction && (
          <div className={styles.predictionOverlay}>
            <div className={styles.letter}>{prediction.letter}</div>
            <div className={styles.confidence}>
              {(prediction.confidence * 100).toFixed(1)}%
            </div>
          </div>
        )}
      </div>

      <div className={styles.wordDisplay}>
        <h3>Spelled Word:</h3>
        <div className={styles.wordText}>{spelledWord || '(start signing...)'}</div>
        <div className={styles.controls}>
          <button onClick={addSpace} disabled={!spelledWord}>Space</button>
          <button onClick={deleteLastLetter} disabled={!spelledWord}>Delete</button>
          <button onClick={clearWord} disabled={!spelledWord}>Clear</button>
        </div>
      </div>

      <div className={styles.instructions}>
        <h4>Instructions:</h4>
        <ul>
          <li>Position your hand clearly in front of the camera</li>
          <li>Hold each letter steady for 1-2 seconds</li>
          <li>Currently supports: <strong>A, B, C</strong></li>
          <li>Model: CNN trained on 9,529 images (99.41% accuracy)</li>
        </ul>
      </div>
    </div>
  );
}
