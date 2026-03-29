import './AlphabetPractice.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

// The full list of signs your model recognizes
const ALPHABET = "ABCDEFGHIKLMNOPQRSTUVWXY".split("");

export default function AlphabetPractice() {
  const webcamRef = useRef<Webcam>(null);
  
  // Existing States
  const [prediction, setPrediction] = useState<string>("None");
  const [confidence, setConfidence] = useState<number>(0);
  
  // New "Practice" States
  const [targetIndex, setTargetIndex] = useState(0);

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      try {
        const response = await fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageSrc }),
        });

        if (response.ok) {
          const data = await response.json();
          const detected = data.prediction.toUpperCase();
          setPrediction(detected);
          setConfidence(data.confidence);

          // EASY MATCH LOGIC: 
          // If what you sign matches the current target, jump to the next letter!
          if (detected === ALPHABET[targetIndex] && data.confidence > 0.75) {
            setTargetIndex((prev) => (prev + 1) % ALPHABET.length);
          }
        }
      } catch (error) {
        console.error("Python server is not responding.");
      }
    }
  }, [targetIndex]); // We add targetIndex here so the function knows the current goal

  useEffect(() => {
    const interval = setInterval(capture, 1000);
    return () => clearInterval(interval);
  }, [capture]);

  // Progress percentage for the bar
  const progress = ((targetIndex) / ALPHABET.length) * 100;

  return (
    <div className="app-container">
      <h1>ASL Practice Mode</h1>

      {/* Progress Bar UI */}
      <div className="progress-container">
        <p>Letter {targetIndex + 1} of {ALPHABET.length}</p>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="main-layout">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          mirrored={true}
          className="webcam-view"
        />

        <div className="status-card">
          <div className="target-section">
            <span className="label">NEXT SIGN:</span>
            <div className="target-letter">{ALPHABET[targetIndex]}</div>
          </div>
          
          <hr />

          <div className="detected-section">
            <span className="label">YOU ARE SIGNING:</span>
            <div className="detected-letter">{prediction}</div>
            <p>Confidence: {(confidence * 100).toFixed(0)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

