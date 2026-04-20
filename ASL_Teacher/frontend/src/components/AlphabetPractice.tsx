import './AlphabetPractice.css';
import Sombra from '../assets/sombra.png';
import { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import Header from './mini/Header';
import { useCharacter } from './characterContext';

const ALPHABET = 'ABCDEFGHIKLMNOPQRSTUVWXY'.split('');
const API_BASE_URL = 'http://localhost:8000';

interface TopPrediction {
  letter: string;
  probability: number;
}

export default function AlphabetPractice() {
  const webcamRef = useRef<Webcam>(null);
  const { selectedCharacter, selectedHat } = useCharacter();
  
  // Detection States
  const [prediction, setPrediction] = useState<string>("None");
  const [confidence, setConfidence] = useState<number>(0);
  const [topPredictions, setTopPredictions] = useState<TopPrediction[]>([]);
  const [targetIndex, setTargetIndex] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isSuccessFlash, setIsSuccessFlash] = useState(false);

  const [aiFeedback, setAiFeedback] = useState('Tap "Get Tip" for ASL coaching feedback.');
  const [geminiStatus, setGeminiStatus] = useState('idle');
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const targetSign = ALPHABET[targetIndex];
  const alternatives = topPredictions.slice(1, 4);

  const handleNext = useCallback(() => {
    setTargetIndex((prev) => (prev + 1) % ALPHABET.length);
    setFailedAttempts(0);
    setAiFeedback('');
    setGeminiStatus('idle');
    setFeedbackError(null);
    setIsSuccessFlash(true);
  }, []);

  const handleBack = () => {
    setTargetIndex((prev) => (prev === 0 ? ALPHABET.length - 1 : prev - 1));
    setFailedAttempts(0);
    setGeminiStatus('idle');
    setFeedbackError(null);
  };

  const requestAiFeedback = useCallback(async () => {
    if (isFeedbackLoading) {
      return;
    }

    setIsFeedbackLoading(true);
    setGeminiStatus('requesting');
    setFeedbackError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_sign: targetSign,
          detected_sign: prediction,
          confidence,
          top_predictions: topPredictions,
          failed_attempts: failedAttempts,
        }),
      });

      if (!response.ok) {
        throw new Error(`Feedback request failed (${response.status})`);
      }

      const data = await response.json();
      const status = String(data.status || 'unknown');
      const feedback = String(data.feedback || '');
      const geminiUsed = Boolean(data.gemini_used);
      const error = data.error ? String(data.error) : null;

      setGeminiStatus(status);
      setAiFeedback(feedback);
      if (!geminiUsed || error) {
        setFeedbackError(error || 'Gemini was not used for this response.');
      }
    } catch (error) {
      setGeminiStatus('request_error');
      setFeedbackError('Could not fetch AI feedback. Check backend and Gemini key setup.');
    } finally {
      setIsFeedbackLoading(false);
    }
  }, [confidence, failedAttempts, isFeedbackLoading, prediction, targetSign, topPredictions]);

  useEffect(() => {
    if (!isSuccessFlash) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsSuccessFlash(false);
    }, 1200);

    return () => clearTimeout(timeout);
  }, [isSuccessFlash]);

  useEffect(() => {
    setFeedbackError(null);
  }, [targetIndex]);

  const capture = useCallback(async () => {
    if (!webcamRef.current) {
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageSrc }),
      });

      if (!response.ok) {
        throw new Error(`Predict request failed (${response.status})`);
      }

      const data = await response.json();
      const detected = String(data.prediction || 'None').toUpperCase();
      const currentConfidence = Number(data.confidence || 0);
      const incomingTopPredictions: TopPrediction[] = Array.isArray(data.top_predictions)
        ? data.top_predictions.map((entry: TopPrediction) => ({
            letter: String(entry.letter || '').toUpperCase(),
            probability: Number(entry.probability || 0),
          }))
        : [];

      setPrediction(detected);
      setConfidence(currentConfidence);
      setTopPredictions(incomingTopPredictions);

      if (detected === targetSign && currentConfidence > 0.75) {
        handleNext();
        return;
      }

      if (detected !== 'NONE' && detected !== 'None') {
        setFailedAttempts((prev) => prev + 1);
      }
    } catch (error) {
      setFeedbackError('Prediction service is not responding. Ensure uvicorn main:app is running.');
    }
  }, [handleNext, targetSign]);

  useEffect(() => {
    const interval = setInterval(capture, 1000);
    return () => clearInterval(interval);
  }, [capture]);

  const progress = (targetIndex / ALPHABET.length) * 100;

  return (
    <div>
      <Header />
      <div className="practice-container">
        <div className="left">
          <div className="progress-section">
            <span className="progress-label">
              Letter {targetIndex + 1} of {ALPHABET.length}
            </span>
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

            <div className={`status-card ${isSuccessFlash ? 'status-card-success' : ''}`}>
              <span className="label">Target Sign</span>
              <div className="target-letter">{targetSign}</div>

              <div className="detected-section">
                <span className="label">Detected</span>
                <div className="detected-letter">{prediction !== 'NONE' ? prediction : '---'}</div>
                <p className="confidence-text">Confidence: {(confidence * 100).toFixed(0)}%</p>
                <p className="attempt-text">Attempts on this sign: {failedAttempts}</p>

                <div className="alternatives-block">
                  <span className="label">Top Alternatives</span>
                  {alternatives.length > 0 ? (
                    <ul className="alternatives-list">
                      {alternatives.map((alt, idx) => (
                        <li key={`${alt.letter}-${idx}`}>
                          <span>{alt.letter}</span>
                          <span>{(alt.probability * 100).toFixed(1)}%</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted">Sign once to see alternatives.</p>
                  )}
                </div>

                <div className="ai-coach">
                  <div className="coach-header">
                    <span className="label">AI Coach</span>
                    <button className="coach-button" onClick={requestAiFeedback} disabled={isFeedbackLoading}>
                      {isFeedbackLoading ? 'Getting tip...' : 'Get Tip'}
                    </button>
                  </div>
                  <p className="coach-status">Status: {geminiStatus}</p>
                  <p className="coach-message">{aiFeedback || 'No Gemini tip returned yet.'}</p>
                  {feedbackError && <p className="coach-error">{feedbackError}</p>}
                </div>
              </div>

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