import axios from 'axios';

// ── Auth / game backend (FastAPI + Postgres) ──────────────────────────────────
// Run with: uvicorn app.main:app --reload --port 8000
export const authApi = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

// ── CV / gesture backend (hand-tracker + Gemini) ─────────────────────────────
// Run with: uvicorn main:app --reload --port 8001
export const cvApi = axios.create({
  baseURL: 'http://localhost:8001',
});

// Automatically attach the JWT token to every auth request
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth helpers ──────────────────────────────────────────────────────────────

export async function login(username: string, password: string): Promise<string> {
  // Backend expects OAuth2 form data (not JSON) for /login
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const res = await authApi.post('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const token: string = res.data.access_token;
  localStorage.setItem('token', token);
  return token;
}

export async function signup(
  email: string,
  username: string,
  password: string
): Promise<void> {
  await authApi.post('/auth/signup', { email, username, password });
}

export function logout(): void {
  localStorage.removeItem('token');
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// ── CV helpers ────────────────────────────────────────────────────────────────

export async function predictSign(imageDataUrl: string) {
  const res = await cvApi.post('/predict', { image: imageDataUrl });
  return res.data as {
    prediction: string;
    confidence: number;
    detected: boolean;
    top_predictions: { letter: string; probability: number }[];
  };
}

export async function getGeminiFeedback(payload: {
  target_sign: string;
  detected_sign: string;
  confidence: number;
  failed_attempts: number;
  top_predictions: { letter: string; probability: number }[];
}) {
  const res = await cvApi.post('/feedback', payload);
  return res.data as {
    feedback: string;
    status: string;
    gemini_used: boolean;
    error: string | null;
  };
}