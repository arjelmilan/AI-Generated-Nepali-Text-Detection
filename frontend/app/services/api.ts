const BASE_URL = 'http://localhost:8000';

function getHeaders(extraHeaders: Record<string, string> = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extraHeaders
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('nepdetect_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}
// ─── Request / Response Types (matching backend API_REFERENCE.md) ────────────

export interface AnalyzeRequest {
  text: string;
  max_evals?: number;  // default: 250. Range 50–500. Lower = faster.
  batch_size?: number; // default: 8. Higher = faster but more memory.
}

export interface AnalyzeResponse {
  prediction: 'Human' | 'AI';
  probability: number;                    // softmax probability of predicted class (0.0–1.0)
  probabilities: Record<string, number>;  // { Human: x, AI: y }
  certainties: Record<string, number>;    // SHAP-derived certainty scores
  html_viz: string | null;               // self-contained SHAP HTML or null
  tokens_count: number;
  chunks_count: number;
}

// ─── History / Stats (no backend endpoint — kept as mock) ──────────────────

// Used by HeatmapVisualization for the fallback sentence-level display
export interface SentenceAnalysis {
  text: string;
  type: 'human' | 'mixed' | 'ai';
}

export interface HistoryItem {
  id: string;
  text: string;
  date: string;
  type: 'Human' | 'Mixed' | 'AI';
  score: number;
}

export interface StatsData {
  totalCount: number;
  dailyAvg: number;
  flagCount: number;
  flagRate: number;
  systemLoad: 'Normal' | 'High' | 'Critical';
  avgResponseMs: number;
}

export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// ─── API Functions ───────────────────────────────────────────────────────────

/**
 * Health-check: returns true if the model backend is loaded and ready.
 */
export async function isBackendReady(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
}

/**
 * Sends text to the backend for AI vs Human classification + SHAP explanation.
 * Throws an Error with a user-readable message on failure.
 */
export async function analyzeText(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  if (!request.text.trim()) {
    throw new Error('Please provide some text.');
  }

  const payload = {
    text: request.text,
    max_evals: request.max_evals ?? 250,
    batch_size: request.batch_size ?? 8,
  };

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/analyze`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      'Cannot reach the backend. Make sure the server is running at ' + BASE_URL
    );
  }

  if (!res.ok) {
    let detail = `Server error (${res.status})`;
    try {
      const err = await res.json();
      detail = err.detail ?? detail;
    } catch { /* ignore parse error */ }
    throw new Error(detail);
  }

  return res.json() as Promise<AnalyzeResponse>;
}

// ─── Auth Functions ───────────────────────────────────────────────────────────

export async function registerUser(email: string, password: string):Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    let detail = `Server error (${res.status})`;
    try {
      const err = await res.json();
      detail = err.detail ?? detail;
    } catch { /* ignore parse error */ }
    throw new Error(detail);
  }
  return res.json() as Promise<AuthResponse>;
}

export async function loginUser(email: string, password: string):Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    let detail = `Server error (${res.status})`;
    try {
      const err = await res.json();
      detail = err.detail ?? detail;
    } catch { /* ignore parse error */ }
    throw new Error(detail);
  }
  return res.json() as Promise<AuthResponse>;
}

export async function getMe(): Promise<User> {
  const res = await fetch(`${BASE_URL}/me`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error('Not authenticated');
  }
  return res.json() as Promise<User>;
}

// ─── Real endpoints (previously mocked) ──────────────────────────────────────

export async function getRecentScans(): Promise<HistoryItem[]> {
  const res = await fetch(`${BASE_URL}/history`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch history');
  }
  return res.json() as Promise<HistoryItem[]>;
}

export async function getSystemStats(): Promise<StatsData> {
  const res = await fetch(`${BASE_URL}/stats`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch stats');
  }
  return res.json() as Promise<StatsData>;
}
