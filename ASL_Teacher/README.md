# SignQuest — ASL Teacher

Senior Design Project | University of Texas at Arlington
Team: Dhakal B., Tran Christopher, Macias N., Truong A., Lopez J., Tran Cong, To M.
Advisor: Chenxi Wang

---

## Project Overview

SignQuest is a web application that teaches American Sign Language (ASL) using real-time hand gesture recognition via webcam, gamified learning, and AI-powered feedback.

---

## Architecture

The project consists of three separate servers that must all be running:

| Server | What it does | Port |
|--------|-------------|------|
| CV/ML Backend | ASL gesture detection, Gemini AI feedback | 8000 |
| Auth/API Backend | Login, signup, user accounts, game data | 8001 |
| Frontend | React web app | 5173 |
| PostgreSQL (Docker) | Database for auth backend | 5432 |

---

## Prerequisites

- Python 3.11 or 3.12 (TensorFlow does not support 3.13+)
- Node.js 18+
- Docker Desktop (must be running before starting the database)

---

## Setup & Running

### Step 1 — Start Docker (PostgreSQL)

Make sure Docker Desktop is open, then from the `backend` folder:

```bash
cd backend
docker-compose up -d
```

Verify it's running:
```bash
docker ps
```
You should see `backend-db-1` with status `Up`.

> **Note:** If you have a local PostgreSQL installation also running on port 5432, stop it first:
> ```powershell
> Stop-Service postgresql*
> ```

---

### Step 2 — Set up Python virtual environment

From the `backend` folder (only needs to be done once):

```bash
cd backend
python -m venv venv
```

Activate it (Windows):
```bash
venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

> If `bcrypt` causes errors, pin it:
> ```bash
> pip install bcrypt==4.0.1
> ```

---

### Step 3 — Start the CV/ML Backend (Port 8000)

In a terminal with venv activated, from the `backend` folder:

```bash
uvicorn main:app --reload
```

This handles ASL gesture detection and Gemini AI feedback.

---

### Step 4 — Start the Auth/API Backend (Port 8001)

In a second terminal with venv activated, from the `backend` folder:

```bash
uvicorn app.main:app --reload --port 8001
```

This handles user accounts, login, signup, and game data. Tables are created automatically on first startup.

---

### Step 5 — Start the Frontend

In a third terminal, from the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Environment Variables (Optional)

To enable Gemini AI feedback, set your API key before starting the CV backend:

```bash
# Windows PowerShell
$env:GEMINI_API_KEY="your_key_here"
```

Without this key, the app still works — gesture detection functions normally, AI feedback is disabled.

---

## Quick Verification

After all three servers are running:

1. Go to `http://localhost:5173`
2. Click **SIGN UP** and create an account
3. Log in — you should reach the main menu
4. Go to **Learning Mode** — the webcam should activate and detect ASL letters
5. Go to **Settings** — dark mode, music, volume, and account details should all work

Auth API docs: `http://localhost:8001/docs`
CV API docs: `http://localhost:8000/docs`

---

## Common Issues

| Problem | Fix |
|---------|-----|
| `docker-compose` fails | Make sure Docker Desktop is open and running |
| Port 5432 already in use | Stop local PostgreSQL: `Stop-Service postgresql*` |
| `bcrypt` version error on signup | Run `pip install bcrypt==4.0.1` |
| `tensorflow` not found | You're on Python 3.13+. Use Python 3.11 or 3.12 |
| `uvicorn` not recognized | Virtual environment is not activated — run `venv\Scripts\activate` |
| Music doesn't autoplay | Click anywhere on the page first (browser security requirement) |
