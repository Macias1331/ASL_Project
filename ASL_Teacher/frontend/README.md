# SignQuest Frontend

React + TypeScript + Vite frontend for the SignQuest ASL Teacher app.

## Running

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

Requires both backends to be running — see the root `README.md` for full setup instructions.

## Key Dependencies

- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM
- TensorFlow.js (for in-browser ASL model)
- MediaPipe (hand landmark detection)

## Environment

The frontend expects:
- CV/ML backend at `http://localhost:8000`
- Auth backend at `http://localhost:8001`
