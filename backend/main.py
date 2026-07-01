import os
import torch
import numpy as np
import shap
from scipy.special import softmax
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional
import time
import re
import uuid
from sqlalchemy.orm import Session
from database import engine, get_db, Base
import models
import schemas
import auth

try:
    models.Base.metadata.create_all(bind=engine)
    print("Database  jodiyo successfully.")
except Exception as e:
    print(f"Databasse jodiena problem vayo. Details: {e}")


MODEL_PATH = os.environ.get("MODEL_PATH", os.path.join(os.path.dirname(__file__), "./models"))

app = FastAPI(title="Nepali detect API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

model = None
tokenizer = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

@app.on_event("startup")
def load_resources():
    global model, tokenizer
    try:
        print(f"Loading  from {MODEL_PATH} on {device}...")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
        model = AutoModelForSequenceClassification.from_pretrained(
            MODEL_PATH,
            num_labels=2,
            problem_type="single_label_classification",
            local_files_only=True
        )
        model.to(device)
        model.eval()
        print("Model loaded successfully.")
    except Exception as e:
        print(f"model eerror from '{MODEL_PATH}'. Details: {e}")


class DocumentSHAPWrapper:

    def __init__(
        self,
        model,
        tokenizer,
        device,
        class_names=("Human", "AI"),
        max_length=512,
        overlap=30,
        batch_size=8
    ):

        self.model = model.to(device)
        self.model.eval()
        torch.set_grad_enabled(False)

        self.tokenizer = tokenizer
        self.device = device
        self.class_names = class_names

        self.max_length = min(max_length, tokenizer.model_max_length)
        self.overlap = overlap
        self.chunk_size = self.max_length - 2
        self.batch_size = batch_size

        self.explainer = shap.Explainer(
            self._predict_document,
            masker=shap.maskers.Text(self.tokenizer),
            algorithm="partition",
            output_names=self.class_names,
        )


    def _split_into_chunks(self, text):

        tokens = self.tokenizer.encode(
            text,
            add_special_tokens=False,
            truncation=True,
            max_length=50000
        )

        stride = max(1, self.chunk_size - self.overlap)

        chunks = []

        for i in range(0, len(tokens), stride):

            part = tokens[i:i + self.chunk_size]

            if len(part) < 3:
                continue

            chunks.append(
                self.tokenizer.decode(
                    part,
                    skip_special_tokens=True
                )
            )

        return chunks if chunks else [text]


    def _split_into_chunks_no_overlap(self, text):

        tokens = self.tokenizer.encode(
            text,
            add_special_tokens=False,
            truncation=True,
            max_length=50000
        )

        stride = self.chunk_size

        chunks = []

        for i in range(0, len(tokens), stride):

            part = tokens[i:i + self.chunk_size]

            if len(part) < 3:
                continue

            chunks.append(
                self.tokenizer.decode(
                    part,
                    skip_special_tokens=True
                )
            )

        return chunks if chunks else [text]

    def _predict_document(self, texts):
        all_avg_logits = []

        with torch.inference_mode():

            for text in texts:

                if not text.strip():

                    all_avg_logits.append(
                        np.zeros(len(self.class_names)) + 1e-6
                    )

                    continue

                chunks = self._split_into_chunks(text)
                chunk_logits = []
                
                for i in range(0, len(chunks), self.batch_size):
                    batch_chunks = chunks[i:i + self.batch_size]
                    
                    encodings = self.tokenizer(
                        batch_chunks,
                        padding=True,
                        truncation=True,
                        max_length=self.max_length,
                        return_tensors="pt"
                    )
                    
                    encodings = {
                        k: v.to(self.device)
                        for k, v in encodings.items()
                    }

                    outputs = self.model(**encodings)
                    logits = outputs.logits
                    
                    chunk_logits.append(logits.detach().cpu())
                
                all_chunk_logits = torch.cat(chunk_logits, dim=0)
                avg_logits = torch.mean(all_chunk_logits, dim=0).numpy()

                all_avg_logits.append(avg_logits)

        return np.array(all_avg_logits)

    def _generate_token_html(self, tokens, values):
        max_val = np.max(np.abs(values))

        if max_val == 0:
            max_val = 1e-9

        def shap_color(val):
            norm = val / max_val
            norm = np.clip(norm, -1, 1)

            if norm > 0:
                intensity = norm
                r = 255
                g = int(240 * (1 - intensity * 0.8))
                b = int(240 * (1 - intensity * 0.8))
            else:
                intensity = -norm
                r = int(240 * (1 - intensity * 0.8))
                g = int(240 * (1 - intensity * 0.8))
                b = 255

            return f"rgb({r},{g},{b})"

        html_parts = []

        for token, val in zip(tokens, values):

            color = shap_color(val)

            token_esc = (
                token
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace(" ", "&nbsp;")
            )

            html_parts.append(f"""<span
                title="SHAP value: {val:.5f}"
                style="
                    background-color:{color};
                    color:#1a1a1a;
                    padding:2px 1px;
                    margin:0;
                    font-weight:500;
                    display:inline;
                    transition:all 0.2s ease;
                    line-height:1.8;
                "
                onmouseover="this.style.transform='scale(1.05)'"
                onmouseout="this.style.transform='scale(1)'"
            >{token_esc}</span>""")

        return "".join(html_parts)

    def _wrap_html(self, content):
        html = f"""
        <div style="
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', sans-serif;
            padding: 24px;
            border-radius: 8px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        ">

            <div style="
                text-align: center;
                padding: 12px;
                margin-bottom: 20px;
                border-radius: 6px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                font-size: 13px;
            ">

                <span style="
                    display: inline-block;
                    padding: 4px 12px;
                    background: #dbeafe;
                    color: #1e40af;
                    border-radius: 4px;
                    font-weight: 600;
                    margin-right: 8px;
                ">Human</span>
                
                <span style="
                    display: inline-block;
                    padding: 4px 12px;
                    background: #fee2e2;
                    color: #991b1b;
                    border-radius: 4px;
                    font-weight: 600;
                    margin-left: 8px;
                ">AI</span>

                <div style="
                    margin-top: 8px;
                    font-size: 12px;
                    color: #6b7280;
                ">
                    Darker colors indicate stronger contributions
                </div>

            </div>

            <div style="
                font-size: 15px;
                line-height: 2;
                word-break: break-word;
                padding: 16px;
                background: #fafafa;
                border-radius: 6px;
                border: 1px solid #e5e7eb;
            ">

                {content}

            </div>

        </div>
        """

        return html

    def generate_chunked_html(self, text, max_evals=100):

        tokens = self.tokenizer.encode(
            text,
            add_special_tokens=False
        )

        if len(tokens) <= self.chunk_size:

            explanation = self.explainer([text], max_evals=max_evals)

            tokens = explanation.data[0]
            values = explanation.values[0, :, 1]

            html_content = self._generate_token_html(tokens, values)

            return self._wrap_html(html_content), 1

        chunks = self._split_into_chunks_no_overlap(text)
        all_token_html = []

        for chunk in chunks:

            explanation = self.explainer([chunk], max_evals=max_evals)

            tokens = explanation.data[0]
            values = explanation.values[0, :, 1]

            chunk_html = self._generate_token_html(tokens, values)

            all_token_html.append(chunk_html)

        combined_html = " ".join(all_token_html)

        return self._wrap_html(combined_html), len(chunks)

    def _compute_shap_prediction(self, explanation, class_id):
        base_value = explanation.base_values[0, class_id]
        shap_sum = explanation.values[0, :, class_id].sum()
        reconstructed_logit = base_value + shap_sum
        
        all_logits = []
        for i in range(len(self.class_names)):
            base = explanation.base_values[0, i]
            shap_s = explanation.values[0, :, i].sum()
            all_logits.append(base + shap_s)
        
        reconstructed_probs = softmax(all_logits)
        return reconstructed_logit, reconstructed_probs

    def _compute_certainty_per_class(self, explanation):
        raw_certainties = {}
        
        for class_id, class_name in enumerate(self.class_names):
            shap_values = explanation.values[0, :, class_id]
            total_contribution = np.abs(shap_values).sum()
            
            positive_vals = shap_values[shap_values > 0]
            negative_vals = shap_values[shap_values < 0]
            
            pos_sum = positive_vals.sum() if len(positive_vals) > 0 else 0
            neg_sum = abs(negative_vals.sum()) if len(negative_vals) > 0 else 0
            
            if pos_sum + neg_sum > 0:
                consistency = pos_sum / (pos_sum + neg_sum)
            else:
                consistency = 0.5
            
            _, reconstructed_probs = self._compute_shap_prediction(explanation, class_id)
            class_prob = reconstructed_probs[class_id]
            
            threshold = np.percentile(np.abs(shap_values), 75)
            num_strong = np.sum(np.abs(shap_values) > threshold)
            total_feats = len(shap_values)
            strong_ratio = num_strong / total_feats if total_feats > 0 else 0
            
            raw_certainty = (
                0.50 * class_prob +
                0.30 * consistency +
                0.10 * min(total_contribution / 10, 1.0) +
                0.10 * strong_ratio
            )
            raw_certainties[class_name] = raw_certainty
        
        total = sum(raw_certainties.values())
        if total > 0:
            return {k: v / total for k, v in raw_certainties.items()}
        return {k: 1.0 / len(self.class_names) for k in self.class_names}

    def explain(self, text, max_evals=100):

        if not text.strip():
            return None, None, None, 0, None

        explanation = self.explainer([text], max_evals=max_evals)

        certainty_per_class = self._compute_certainty_per_class(explanation)

        html_viz, num_chunks = self.generate_chunked_html(
            text,
            max_evals
        )

        return None, None, html_viz, num_chunks, certainty_per_class

# ==========================================
# 3. API ENDPOINTS
# ==========================================

# --- Auth ---

@app.post("/register", response_model=schemas.TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: schemas.UserRegister, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
    user = models.User(
        email=payload.email,
        hashed_password=auth.hash_password(payload.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = auth.create_access_token({"sub": str(user.id)})
    return schemas.TokenResponse(access_token=token)


@app.post("/login", response_model=schemas.TokenResponse)
def login(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not auth.verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    token = auth.create_access_token({"sub": str(user.id)})
    return schemas.TokenResponse(access_token=token)


@app.get("/me", response_model=schemas.UserOut)
def me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user


# --- Analysis ---

@app.post("/analyze", response_model=schemas.AnalyzeResponse)
def analyze_text(
    request: schemas.AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    start_time = time.time()
    if not model or not tokenizer:
        raise HTTPException(status_code=503, detail="Model is currently unavailable.")

    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Please provide some text.")

    wrapper = DocumentSHAPWrapper(
        model,
        tokenizer,
        device,
        batch_size=request.batch_size
    )

    try:
        logits = wrapper._predict_document([request.text])[0]
        probs = softmax(logits)
        pred_id = np.argmax(probs)
        pred = wrapper.class_names[pred_id]

        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        _, _, html_viz, num_chunks, certainty_per_class = wrapper.explain(
            request.text,
            max_evals=request.max_evals
        )

        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        token_count = len(tokenizer.encode(request.text, add_special_tokens=False))
        
        probabilities_dict = {
            wrapper.class_names[i]: float(probs[i])
            for i in range(len(wrapper.class_names))
        }

        # Sentence analysis heuristic
        sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', request.text) if s.strip()]
        sentence_analysis = []
        if sentences:
            sentence_logits = wrapper._predict_document(sentences)
            for i, sent in enumerate(sentences):
                sent_probs = softmax(sentence_logits[i])
                sent_pred_id = np.argmax(sent_probs)
                sent_type = wrapper.class_names[sent_pred_id]
                sentence_analysis.append(schemas.SentenceAnalysisItem(text=sent, type=sent_type))
        else:
            sentence_analysis.append(schemas.SentenceAnalysisItem(text=request.text, type="Unknown"))

        execution_time_ms = (time.time() - start_time) * 1000.0

        scan_id = f"SCN-{uuid.uuid4().hex[:6].upper()}"
        db_scan = models.ScanHistory(
            scan_id=scan_id,
            text=request.text[:1000],
            prediction=pred,
            probability=float(probs[pred_id]),
            type=pred,
            execution_time_ms=execution_time_ms,
            user_id=current_user.id
        )
        db.add(db_scan)
        db.commit()
        db.refresh(db_scan)

        return schemas.AnalyzeResponse(
            prediction=pred,
            probability=float(probs[pred_id]),
            probabilities=probabilities_dict,
            certainties=certainty_per_class,
            html_viz=html_viz,
            tokens_count=token_count,
            chunks_count=num_chunks,
            sentence_analysis=sentence_analysis
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history", response_model=List[schemas.HistoryItem])
def get_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    scans = (
        db.query(models.ScanHistory)
        .filter(models.ScanHistory.user_id == current_user.id)
        .order_by(models.ScanHistory.created_at.desc())
        .limit(50)
        .all()
    )
    history = []
    for scan in scans:
        history.append(schemas.HistoryItem(
            id=scan.scan_id,
            text=scan.text,
            date=scan.created_at,
            type=scan.type,
            score=int(scan.probability * 100) if scan.probability else 0
        ))
    return history

@app.get("/stats", response_model=schemas.SystemStats)
def get_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    from sqlalchemy.sql import func
    base_q = db.query(models.ScanHistory).filter(models.ScanHistory.user_id == current_user.id)
    total = base_q.count()
    if total == 0:
        return schemas.SystemStats(
            totalCount=0, dailyAvg=0, flagCount=0, flagRate=0.0, systemLoad="Normal", avgResponseMs=0
        )

    ai_flags = base_q.filter(models.ScanHistory.type == 'AI').count()
    first_record = db.query(func.min(models.ScanHistory.created_at)).filter(models.ScanHistory.user_id == current_user.id).scalar()
    last_record = db.query(func.max(models.ScanHistory.created_at)).filter(models.ScanHistory.user_id == current_user.id).scalar()

    days = 1
    if first_record and last_record:
        delta = (last_record - first_record).days
        days = delta if delta > 0 else 1

    avg_response = db.query(func.avg(models.ScanHistory.execution_time_ms)).filter(models.ScanHistory.user_id == current_user.id).scalar()

    return schemas.SystemStats(
        totalCount=total,
        dailyAvg=int(total / days),
        flagCount=ai_flags,
        flagRate=round((ai_flags / total) * 100, 2) if total > 0 else 0.0,
        systemLoad="Normal",
        avgResponseMs=int(avg_response) if avg_response else 0
    )

@app.get("/health")
def health_check():
    if model and tokenizer:
        return {"status": "healthy", "device": str(device)}
    else:
        raise HTTPException(status_code=503, detail="Model unavailable")
