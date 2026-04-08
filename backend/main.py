from fastapi import FastAPI, UploadFile, File
import pandas as pd
import pickle
from fastapi.middleware.cors import CORSMiddleware

from utils import classify_risk, validate_data
from shap_utils import get_shap_values

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
with open("backend/model/model.pkl", "rb") as f:
    model, scaler = pickle.load(f)

with open("backend/model/features.pkl", "rb") as f:
    features = pickle.load(f)


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)

    valid, msg = validate_data(df, features)
    if not valid:
        return {"error": msg}

    df = df[features]
    X = scaler.transform(df)

    preds = model.predict(X)

    df["risk_score"] = preds
    df["risk_category"] = df["risk_score"].apply(classify_risk)

    return df.to_dict(orient="records")


@app.post("/shap")
async def shap_explain(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    df = df[features]

    X = scaler.transform(df)

    shap_values = get_shap_values(model, X[:1])

    return {
        "shap_values": shap_values.values.tolist(),
        "base_value": float(shap_values.base_values[0])
    }
