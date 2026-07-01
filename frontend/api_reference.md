# NepDetect Backend API Reference

**Base URL:** `http://localhost:8000`  
**Auth:** JWT Bearer token — include `Authorization: Bearer <token>` header on protected routes.

---

## Authentication

### POST `/register`
Create a new user account.

**Request body:**
```json
{ "email": "user@example.com", "password": "yourpassword" }
```
**Response `201`:**
```json
{ "access_token": "<jwt>", "token_type": "bearer" }
```
**Errors:** `400` if email already registered.

---

### POST `/login`
Log in with existing credentials.

**Request body:**
```json
{ "email": "user@example.com", "password": "yourpassword" }
```
**Response `200`:**
```json
{ "access_token": "<jwt>", "token_type": "bearer" }
```
**Errors:** `401` if credentials are invalid.

---

### GET `/me` 🔒
Returns the currently authenticated user.

**Response `200`:**
```json
{ "id": 1, "email": "user@example.com", "created_at": "2024-01-01T00:00:00" }
```

---

## Analysis

### POST `/analyze` 🔒
Submit text for AI detection. Saves the result to the user's history.

**Request body:**
```json
{
  "text": "The text to analyze",
  "max_evals": 250,
  "batch_size": 8
}
```
- `max_evals` (optional, default `250`): SHAP evaluation budget — lower = faster.
- `batch_size` (optional, default `8`): Chunk batch size for processing.

**Response `200`:**
```json
{
  "prediction": "Human",
  "probability": 0.94,
  "probabilities": {
    "Human": 0.94,
    "AI": 0.06
  },
  "certainties": {
    "Human": 0.72,
    "AI": 0.28
  },
  "html_viz": "<div>...SHAP token-level HTML visualization...</div>",
  "tokens_count": 128,
  "chunks_count": 1,
  "sentence_analysis": [
    { "text": "First sentence.", "type": "Human" },
    { "text": "Second sentence.", "type": "AI" }
  ]
}
```
**Errors:** `400` empty text, `503` model not loaded yet.

---

## History

### GET `/history` 🔒
Returns the last 50 analyses performed by the current user, newest first.

**Response `200`:**
```json
[
  {
    "id": "SCN-A1B2C3",
    "text": "The analyzed text (first 1000 chars)...",
    "date": "2024-01-01T12:00:00",
    "type": "AI",
    "score": 94
  }
]
```
- `type`: `"Human"` or `"AI"`
- `score`: probability as a percentage (0–100)

---

## Statistics

### GET `/stats` 🔒
Returns usage statistics computed **only from the current user's** analyses.

**Response `200`:**
```json
{
  "totalCount": 42,
  "dailyAvg": 7,
  "flagCount": 12,
  "flagRate": 28.57,
  "systemLoad": "Normal",
  "avgResponseMs": 3200
}
```
- `flagCount`: number of analyses classified as `"AI"`
- `flagRate`: percentage of analyses flagged as AI
- `avgResponseMs`: average end-to-end processing time in milliseconds

---

## Health

### GET `/health`
Server and model status check (no auth required).

**Response `200`:**
```json
{ "status": "healthy", "device": "cpu" }
```
**Response `503`:** Model not yet loaded.

---

## Error Format
All errors follow FastAPI's standard shape:
```json
{ "detail": "Error message here" }
```

## HTTP Status Summary
| Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Created (register) |
| `400` | Bad request / validation error |
| `401` | Wrong credentials |
| `403` | Missing or invalid token |
| `500` | Server/model error |
| `503` | Model not loaded |
