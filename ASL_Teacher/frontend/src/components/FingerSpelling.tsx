import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

// ASL Alphabet - currently trained on A, B, C
const ALPHABET = ['A', 'B', 'C'];
const PREDICTION_INTERVAL = 500; // Make prediction every 500ms
const NUM_LANDMARKS = 21; // MediaPipe hand landmarks
const NUM_COORDS = 3; // x, y, z per landmark

interface Prediction {
  letter: string;
  confidence: number;
}

interface NormalizationParams {
  mean: number[];
  std: number[];
}

export function FingerSpelling() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [normParams, setNormParams] = useState<NormalizationParams | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [predictionHistory, setPredictionHistory] = useState<string[]>([]);
  const [spelledWord, setSpelledWord] = useState<string>('');
  const predictionIntervalRef = useRef<number | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const lastHandLandmarksRef = useRef<any>(null);

  // Load pre-trained landmark model
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('Loading landmark model from /models/asl_landmarks/model.json...');
        const loadedModel = await tf.loadLayersModel('/models/asl_landmarks/model.json');
        
        // Load normalization parameters
        const normResponse = await fetch('/models/asl_landmarks/normalization.json');
        const normData = await normResponse.json();
        
        setModel(loadedModel);
        setNormParams(normData);
        setIsModelLoaded(true);
        console.log('✅ ASL landmark model loaded successfully');
        console.log('   Input shape:', loadedModel.inputs[0].shape);
        console.log('   Output shape:', loadedModel.outputs[0].shape);
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

  // Extract and normalize landmark features from MediaPipe results
  const extractLandmarkFeatures = (): tf.Tensor | null => {
    if (!lastHandLandmarksRef.current || !normParams) return null;

    const results = lastHandLandmarksRef.current;
    
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      return null;
    }

    const landmarks = results.multiHandLandmarks[0];
    
    // Extract all 63 features (21 landmarks × 3 coordinates)
    const features: number[] = [];
    for (const landmark of landmarks) {
      features.push(landmark.x, landmark.y, landmark.z);
    }

    // Normalize features using training parameters
    const normalizedFeatures = features.map((value, index) => {
      return (value - normParams.mean[index]) / (normParams.std[index] + 1e-8);
    });

    // Create tensor with shape [1, 63] for batch size 1
    const tensor = tf.tensor2d([normalizedFeatures], [1, 63]);
    
    return tensor;
  };

  // Make prediction from MediaPipe landmarks
  const makePrediction = async () => {
    if (!model || !normParams) return;

    try {
      const inputTensor = extractLandmarkFeatures();
      if (!inputTensor) {
        setPrediction(null);
        return;
      }

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
      
      if (maxConfidence > 0.6) {  // Lower threshold for landmark model
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
    <div className="min-h-screen bg-gradient-to-b from-[#121F32] to-[#1a2942]">
      {/* Header */}
      <div className="bg-[#121F32] py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">ASL Fingerspelling Recognition</h2>
          <div className="flex gap-4">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${isModelLoaded ? 'bg-green-500 text-white' : 'bg-yellow-500 text-gray-900'}`}>
              {isModelLoaded ? '✓ Model Loaded' : '⚠ Loading...'}
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${cameraActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {cameraActive ? '✓ Camera Active' : '✗ Camera Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Feed - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="relative">
                <video ref={videoRef} style={{ display: 'none' }} />
                <canvas ref={canvasRef} className="w-full h-auto" width={640} height={480} />
                
                {prediction && (
                  <div className="absolute top-4 right-4 bg-[#FFEFB8] rounded-2xl px-6 py-4 shadow-lg">
                    <div className="text-5xl font-bold text-gray-800 text-center">{prediction.letter}</div>
                    <div className="text-sm text-gray-600 text-center mt-1">
                      {(prediction.confidence * 100).toFixed(1)}% confident
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side Panel - Instructions */}
          <div className="space-y-6">
            {/* Instructions Card */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <div className="inline-block bg-[#FFEFB8] rounded-xl px-4 py-2 mb-4">
                <h3 className="text-lg font-bold text-gray-800">How to Play</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#F6D052] mr-2 text-xl">•</span>
                  <span>Position your hand clearly in front of the camera</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#F6D052] mr-2 text-xl">•</span>
                  <span>Hold each letter steady for 1-2 seconds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#F6D052] mr-2 text-xl">•</span>
                  <span>Currently supports: <strong className="text-[#121F32]">A, B, C</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feedback Display */}
        <div className="mt-8 bg-white rounded-xl shadow-xl p-8">
          <div className="inline-block bg-[#FFEFB8] rounded-xl px-4 py-2 mb-4">
            <h3 className="text-xl font-bold text-gray-800">Real-time Feedback</h3>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 min-h-[120px]">
            <p className="text-gray-500 text-center italic">
              Coming soon: Get instant feedback on your hand positioning and form to improve your ASL signing accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
