# ASL Teacher Backend

Backend service for SignQuest / ASL Teacher, built with FastAPI + PostgreSQL.

This README is written so frontend and CV teams can run the backend locally, inspect all API endpoints, and integrate without waiting on backend changes.

## What This Backend Currently Provides

- Authentication (signup, login, current-user)
- Game APIs (achievements list/unlock, store list/buy)
- Social APIs (friend list, send friend request)
- OpenAPI docs via Swagger UI

Base URL:

```text
http://localhost:8000
```

API prefix:

```text
/api/v1
```

## Prerequisites

- Python 3.9+
- Docker Desktop (or Docker Engine)

## Local Run (Step-by-Step)

### 1. Start PostgreSQL

From backend folder:

```bash
docker-compose up -d
```

### 2. Create and activate a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run API server

```bash
uvicorn app.main:app --reload
```

Server starts on:

```text
http://localhost:8000
```

### 5. Open interactive API docs

- Swagger UI: http://localhost:8000/docs
- OpenAPI JSON: http://localhost:8000/api/v1/openapi.json

## Quick Health Check

```bash
curl http://localhost:8000/
```

Expected:

```json
{"message":"Welcome to ASL Teacher Backend API"}
```

## Auth Flow (Important)

Most game/social routes require a Bearer token.

Typical flow:

1. Create account: POST /api/v1/auth/signup
2. Login: POST /api/v1/auth/login or /api/v1/auth/login-json
3. Copy token from login response
4. Send header on protected routes:

```text
Authorization: Bearer <access_token>
```

## Available APIs

All routes below are under /api/v1.

### Auth

1. POST /auth/signup

Request body:

```json
{
	"username": "demo_user",
	"email": "demo@uta.edu",
	"password": "demo1234"
}
```

Response: created user object.

2. POST /auth/login

Content type: application/x-www-form-urlencoded

Fields:

- username (can be username or email)
- password

Response:

```json
{
	"access_token": "<jwt>",
	"token_type": "bearer"
}
```

3. POST /auth/login-json

Request body:

```json
{
	"username": "demo_user",
	"password": "demo1234"
}
```

Response:

```json
{
	"access_token": "<jwt>",
	"token_type": "bearer"
}
```

4. GET /auth/me (protected)

Returns current authenticated user.

### Game

1. GET /game/achievements (protected)

Returns all achievements.

2. POST /game/achievements/{achievement_id}/unlock (protected)

Unlocks achievement for current user and updates XP/level.

3. GET /game/store/items (protected)

Optional query param:

- category

4. POST /game/store/buy/{item_id} (protected)

Buys an item with user coins.

### Social

1. GET /social/ (protected)

Returns accepted friends for current user.

2. POST /social/request/{username} (protected)

Creates a friend request to a username.

## Copy-Paste cURL Examples

### Signup

```bash
curl -X POST "http://localhost:8000/api/v1/auth/signup" \
	-H "Content-Type: application/json" \
	-d '{"username":"demo_user","email":"demo@uta.edu","password":"demo1234"}'
```

### Login (form)

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-d "username=demo_user&password=demo1234"
```

### Protected route example

Replace TOKEN_HERE with the access_token from login:

```bash
curl "http://localhost:8000/api/v1/auth/me" \
	-H "Authorization: Bearer TOKEN_HERE"
```

## Frontend Team Integration Notes

- Use /auth/login-json if you want pure JSON login requests.
- Save access_token after login, then send Authorization header on protected routes.
- Frontend dev URL http://localhost:5173 is already allowed by CORS.

## CV Team Integration Notes

Current backend does not yet expose model inference endpoints.

What you can do right now:

- Authenticate users
- Read/update game state indirectly through existing game endpoints

Recommended next endpoint for CV integration:

- POST /api/v1/cv/prediction
- Payload idea: user_id, predicted_letter, confidence, timestamp
- Backend action idea: persist attempts and reward XP/coins

## Known Data/Seed Limitation

Achievements and store items may be empty on a fresh DB.

That is expected until seed data is inserted.

## Common Setup Issues

1. Missing greenlet

```bash
pip install greenlet
```

2. EmailStr validation error

```bash
pip install email-validator
```

3. Port 5432 already in use

Either stop local PostgreSQL or map docker-compose PostgreSQL to a different host port.

## Project Structure

- app/main.py: FastAPI app entrypoint
- app/database.py: async SQLAlchemy engine/session
- app/models.py: SQLAlchemy models
- app/schemas.py: Pydantic request/response models
- app/routers/auth.py: auth endpoints
- app/routers/game.py: game endpoints
- app/routers/social.py: social endpoints
- docker-compose.yml: local PostgreSQL
- requirements.txt: backend dependencies
