# ASL Teacher - Hand Sign Recognition

A web-based tool for collecting hand sign samples, training a TensorFlow.js model, and performing real-time sign recognition using MediaPipe Hands.

## Features

- Real-time hand landmark detection using MediaPipe Hands
- UI for collecting labeled samples of hand signs
- Export samples as JSON for further processing
- In-browser training using TensorFlow.js
- Real-time prediction with confidence scores
- Sliding window smoothing for stable predictions

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

## Usage

1. **Collect Samples**
   - Click a letter button (A/B/L/V/Y) to record a sample
   - Make the hand sign and hold it steady
   - The sample is captured automatically
   - Repeat for multiple samples per sign

2. **Train Model**
   - After collecting samples (aim for 10-20 per sign)
   - Click "Export Samples" to save the JSON
   - The model will train in the browser
   - Training progress appears in the console

3. **Live Recognition**
   - Click "Start Predicting" to begin recognition
   - Shows predicted letter and confidence
   - Uses sliding window for stable predictions
   - Click again to stop prediction

## Technical Notes

- Hand landmarks are normalized by:
  - Translating to wrist origin
  - Scaling by max distance to index MCP
  - This matches the Python demo's preprocessing
- Model architecture:
  - Input: 42 features (21 landmarks × 2 coordinates)
  - Dense layers with dropout
  - Softmax output for letter probabilities
- Sliding window smoother reduces jitter

## Dependencies

- React + TypeScript
- MediaPipe (hands, camera_utils, drawing_utils)
- TensorFlow.js
- Vite for development