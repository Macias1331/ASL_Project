# ASL Teacher 

This folder contains the FastAPI backend that powers the real-time American Sign Language (ASL) recognition logic.

##  Setup Instructions

### 1. Virtual Environment
You must use a virtual environment to ensure all dependencies are isolated.

```bash
# Navigate to the backend folder
cd backend

# Create the environment
python3 -m venv venv

# Activate the environment
source venv/bin/activate

2. Install Dependencies

Run this command to install all necessary machine learning and web libraries:

pip install fastapi uvicorn python-multipart opencv-python mediapipe joblib scikit-learn tensorflow pandas

Running the Server
Start the development server using Uvicorn:

uvicorn main:app --reload

then go to frontend on seperate terminal and run

npm run dev