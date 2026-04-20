import './AlphabetPractice.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import Header from './mini/Header';
import { useCharacter } from './characterContext';

// The full list of signs your model recognizes (A-Y, excluding J and Z)
const ALPHABET = "ABCDEFGHIKLMNOPQRSTUVWXY".split("");

export default function AlphabetPractice() {
  const webcamRef = useRef<Webcam>(null);
  const { selectedCharacter, selectedHat } = useCharacter();
  
  // Detection States
  const [prediction, setPrediction] = useState<string>("None");
  const [confidence, setConfidence] = useState<number>(0);
  
  // Progress States
  const [targetIndex, setTargetIndex] = useState(0);

  // Manual Navigation Functions (Step 2)
  const handleNext = () => {
    setTargetIndex((prev) => (prev + 1) % ALPHABET.length);
  };

  const handleBack = () => {
    setTargetIndex((prev) => (prev === 0 ? ALPHABET.length - 1 : prev - 1));
  };

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

          // Success Logic: Match target with > 75% confidence
          if (detected === ALPHABET[targetIndex] && data.confidence > 0.75) {
            handleNext();
          }
        }
      } catch (error) {
        console.error("Python server is not responding. Ensure uvicorn is running.");
      }
    }
  }, [targetIndex]);

  useEffect(() => {
    const interval = setInterval(capture, 1000); // Capture every 1 second
    return () => clearInterval(interval);
  }, [capture]);

  // Progress percentage calculation
  const progress = (targetIndex / ALPHABET.length) * 100;

  return (
    <div>
      <Header />
      <div className="practice-container">
        {/* Progress Section */}
        <div className="left">
          <div className="progress-section">
            <span className="progress-label">
              Letter {targetIndex + 1} of {ALPHABET.length}
            </span>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              ></div>
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
              <span className="label">Target Sign</span>
              <div className="target-letter">{ALPHABET[targetIndex]}</div>
          
              <div className="detected-section">
                <span className="label">Detected</span>
                <div className="detected-letter">
                  {prediction !== "NONE" ? prediction : "---"}
                </div>
                <p style={{ color: '#aaa', fontSize: '0.8rem' }}>
                  Confidence: {(confidence * 100).toFixed(0)}%
                </p>
              </div>
              {/* Navigation Controls */}
              <div className="nav-controls">
                <button className="nav-button" onClick={handleBack}>
                  Back
                </button>
                <button className="nav-button" onClick={handleNext}>
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-end items-end">
        <div className="relative w-[420px] h-[420px]">
          <div className="sombra">
            <img
              src={selectedCharacter.image}
              alt={selectedCharacter.name}
              className="w-full h-full object-contain"
            />

            {selectedHat && (
              <img
                src={selectedHat.image}
                alt={selectedHat.name}
                className={selectedCharacter.hatStyle}
              />
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}