# Explainable AI-Generated Nepali Text Detection using Ensemble Learning

An explainable AI-generated Nepali text detection framework that combines traditional machine learning, transformer-based language models, ensemble learning, and SHAP explainability to accurately distinguish AI-generated Nepali text from human-written text.

## Overview

The rapid advancement of Large Language Models (LLMs) has made AI-generated text increasingly difficult to distinguish from human-written content. While several detection systems exist for high-resource languages such as English, very little work has been conducted for low-resource languages like Nepali.

This project presents an explainable ensemble learning framework for detecting AI-generated Nepali text by combining the strengths of traditional machine learning and transformer-based models. The framework also incorporates SHAP (SHapley Additive exPlanations) to provide token-level explanations for model predictions.

---

## Features

- Custom Nepali AI-generated text dataset
- Traditional Machine Learning models
  - Support Vector Machine (SVM)
  - Logistic Regression
  - Random Forest
  - XGBoost
  - Multinomial Naïve Bayes
- Transformer-based models
  - NepBERTa
  - XLM-RoBERTa
  - Multilingual MiniLM
- Ensemble Learning
  - Soft Voting
  - Bagging
  - Gradient Boosting
  - Stacking Ensemble
- Explainable AI using SHAP
- Comprehensive evaluation using multiple performance metrics

---

## Dataset

A balanced dataset consisting of:

- Human-written Nepali text
  - News articles
  - Wikipedia
- AI-generated Nepali text
  - Generated using multiple prompting strategies
  - Multiple Large Language Models

The dataset contains approximately **20,000 samples**:

- 10,000 Human-written
- 10,000 AI-generated

---



---

## Methodology

The proposed framework consists of four major stages:

1. Data Collection
2. Text Preprocessing
3. Model Training
    - Traditional Machine Learning
    - Transformer Models
4. Ensemble Learning
5. Explainability using SHAP

---

## Models Used

### Traditional Machine Learning

- Support Vector Machine (SVM)
- Logistic Regression
- Random Forest
- XGBoost
- Multinomial Naïve Bayes

### Transformer Models

- NepBERTa
- XLM-RoBERTa
- Multilingual MiniLM-L12-H384

### Ensemble Methods

- Soft Voting
- Bagging
- Gradient Boosting
- Stacking (Gradient Boosting Meta-Learner)

---

## Evaluation Metrics

The models were evaluated using:

- Accuracy
- Precision
- Recall
- F1-score
- Matthews Correlation Coefficient (MCC)
- Area Under ROC Curve (AUC-ROC)

---

## Results

| Model | Accuracy |
|---------|----------|
| Best Traditional ML (SVM) | **96.16%** |
| Best Transformer (XLM-RoBERTa) | **97.28%** |
| Proposed Stacking Ensemble | **98.54%** |

The proposed stacking ensemble outperformed both individual traditional machine learning and transformer-based models while providing interpretable predictions through SHAP.

---

## Explainability

The framework uses **SHAP (SHapley Additive exPlanations)** to explain model predictions.

SHAP highlights the contribution of each token toward the final prediction, making the detection process transparent and interpretable.

Example:

- Red tokens → Push prediction toward AI-generated
- Blue tokens → Push prediction toward Human-written

---

## Technologies Used

- Python
- PyTorch
- Hugging Face Transformers
- Scikit-learn
- XGBoost
- SHAP
- Pandas
- NumPy
- Matplotlib

---



## Future Work

- Expand the dataset with more diverse Nepali text domains.
- Evaluate on newer Large Language Models.
- Investigate cross-generator generalization.
- Explore lightweight transformer architectures for deployment.
- Develop a web-based detection system.

---


---

## License

This project is released under the MIT License.

---

## Acknowledgements

- Hugging Face
- PyTorch
- Scikit-learn
- SHAP
- Kaggle