import React, { useEffect, useRef, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { Hands, Results } from '@mediapipe/hands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import styles from './HandsRecorder.module.css';

const LETTERS = ["A", "B", "L", "V", "Y"];  // same initial set as Python demo

interface Sample {
  label: string;
  features: number[];
  timestamp: number;
}

export function HandsRecorder() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentLabel, setCurrentLabel] = useState<string>("");
  const [predictionMode, setPredictionMode] = useState(false);
  const [lastPrediction, setLastPrediction] = useState<{label: string, confidence: number} | null>(null);

  // Extract features similar to the Python demo
  const extractFeatures = (landmarks: any[]): number[] => {
    // Convert landmarks to xy array (dropping z for now)
    const xy = landmarks.map(lm => [lm.x, lm.y]);
    
    // Normalize: translate to origin (wrist) and scale
    const base = xy[0];
    const xy_ = xy.map(p => [p[0] - base[0], p[1] - base[1]]);
    
    // Scale by max distance to index MCP (similar to Python)
    const dists = xy_.map(p => Math.sqrt(
      Math.pow(p[0] - xy_[9][0], 2) + Math.pow(p[1] - xy_[9][1], 2)
    ));
    const scale = Math.max(...dists, 0.001);
    
    // Scale and flatten
    const normalized = xy_.map(p => [p[0] / scale, p[1] / scale]);
    return normalized.flat();
  };

  // Process hand landmarks and update UI
  const onResults = (results: Results) => {
    const canvasCtx = canvasRef.current?.getContext('2d');
    if (!canvasCtx) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current!.width, canvasRef.current!.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      // Draw landmarks
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
        drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1, radius: 3 });

        // If recording, collect features
        if (isRecording && currentLabel) {
          const features = extractFeatures(landmarks);
          setSamples(prev => [...prev, {
            label: currentLabel,
            features,
            timestamp: Date.now()
          }]);
          setIsRecording(false); // Stop after one sample
        }

        // If in prediction mode, run inference
        if (predictionMode) {
          // TODO: Add TF.js model prediction here
          // For now, just show a mock prediction
          setLastPrediction({
            label: "A",
            confidence: 0.95
          });
        }
      }
    }
    canvasCtx.restore();
  };

  // Initialize MediaPipe Hands and camera
  useEffect(() => {
    if (!videoRef.current) return;

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6
    });

    hands.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await hands.send({image: videoRef.current});
        }
      },
      width: 640,
      height: 480
    });

    camera.start();

    return () => {
      camera.stop();
      hands.close();
    };
  }, []);

  // Export collected samples as JSON
  const exportSamples = () => {
    const blob = new Blob([JSON.stringify(samples, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'asl_samples.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        <video ref={videoRef} className={styles.inputVideo} />
        <canvas ref={canvasRef} className={styles.outputCanvas} width="640" height="480" />
      </div>
      
      <div className={styles.controls}>
        <div className={styles.labelButtons}>
          {LETTERS.map(letter => (
            <button
              key={letter}
              onClick={() => {
                setCurrentLabel(letter);
                setIsRecording(true);
              }}
              className={currentLabel === letter ? styles.activeLabel : ''}
            >
              Record {letter}
            </button>
          ))}
        </div>

        <div className={styles.actionButtons}>
          <button onClick={() => setPredictionMode(!predictionMode)}>
            {predictionMode ? 'Stop Predicting' : 'Start Predicting'}
          </button>
          <button onClick={exportSamples} disabled={samples.length === 0}>
            Export Samples ({samples.length})
          </button>
        </div>

        {lastPrediction && predictionMode && (
          <div className={styles.prediction}>
            Prediction: {lastPrediction.label} ({(lastPrediction.confidence * 100).toFixed(1)}%)
          </div>
        )}

        <div className={styles.sampleCounts}>
          {LETTERS.map(letter => {
            const count = samples.filter(s => s.label === letter).length;
            return (
              <span key={letter} className={styles.sampleCount}>
                {letter}: {count}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}