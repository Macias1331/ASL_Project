import './Spellingbee.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import Header from './mini/Header';
import Sombra from '../assets/sombra.png'

const WORDS = ["CSE", "CAT", "BARDAN", "NOE", "ANDREW", "APPLE"];

export default function SpellingBee() {
  const webcamRef = useRef<Webcam>(null);
  
  // states
  const [wordIndex, setWordIndex] = useState(0); 
  const [charIndex, setCharIndex] = useState(0); 
  const [prediction, setPrediction] = useState("");
  const [message, setMessage] = useState("Spell the word!");

  const currentWord = WORDS[wordIndex];
  const targetLetter = currentWord[charIndex];

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

          // user signs letter correctly 
          if (detected === targetLetter && data.confidence > 0.75) {
            if (charIndex + 1 < currentWord.length) {
              //move on to next letter in word
              setCharIndex(prev => prev + 1);
              setMessage("Nice! Next letter...");
            } else {
              // move on to next word
              setMessage(`Correct! ${currentWord} finished!`);
              setTimeout(() => {
                setWordIndex((prev) => (prev + 1) % WORDS.length);
                setCharIndex(0);
                setMessage("Next word!");
              }, 2000);
            }
          }
        }
      } catch (error) {
        console.error("Backend offline");
      }
    }
  }, [targetLetter, charIndex, wordIndex]);

  useEffect(() => {
    const interval = setInterval(capture, 1000);
    return () => clearInterval(interval);
  }, [capture]);

  return (
    <div className='main'>
      <Header />
      <div className="game-container">
        <h2 className="game-title">ASL Spelling Bee</h2>
        <p className="game-message">{message}</p>

        <div className="word-display">
          {currentWord.split("").map((letter, index) => (
            <span 
              key={index} 
              className={`letter-slot ${index === charIndex ? 'active' : index < charIndex ? 'done' : ''}`}
            >
              {letter}
            </span>
          ))}
        </div>

        <div className="game-layout">
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" mirrored={true} className="webcam-view" />
          
          <div className="prediction-box">
            <span className="label">Your Sign:</span>
            <div className="detected-text">{prediction}</div>
          </div>
        </div>
      </div>
      <img src={Sombra} alt="Sombra" className='sombra' />
    </div>
  );
}