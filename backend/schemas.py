from pydantic import BaseModel
from typing import Dict, Optional, List
from datetime import datetime


# --- Analyze ---
class AnalyzeRequest(BaseModel):
    text: str
    max_evals: int = 180
    batch_size: int = 8

class SentenceAnalysisItem(BaseModel):
    text: str
    type: str

class AnalyzeResponse(BaseModel):
    prediction: str
    probability: float
    probabilities: Dict[str, float]
    certainties: Dict[str, float]
    html_viz: Optional[str] = None
    tokens_count: int
    chunks_count: int
    sentence_analysis: Optional[List[SentenceAnalysisItem]] = None

# --- History ---
class HistoryItem(BaseModel):
    id: str
    text: str
    date: datetime
    type: str
    score: int

# --- Stats ---
class SystemStats(BaseModel):
    totalCount: int
    dailyAvg: int
    flagCount: int
    flagRate: float
    systemLoad: str
    avgResponseMs: int

# --- Auth ---
class UserRegister(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True
