import os
import json
import time
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_DATA_PATH = os.path.join(BASE_DIR, "data", "vehicle_service_data.csv")
DEFAULT_OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")

def train_model(data_path=DEFAULT_DATA_PATH, output_dir=DEFAULT_OUTPUT_DIR):
    print("=" * 60)
    print("🚗 Starting ServiceWise ML Model Training Pipeline")
    print("=" * 60)
    start_time = time.time()

    # 1. Load Dataset
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}")

    print(f"📥 Loading dataset from '{data_path}'...")
    df = pd.read_csv(data_path)
    print(f"✓ Loaded {len(df):,} records with columns: {list(df.columns)}")

    # 2. Features and Target separation
    feature_cols = [
        "vehicle_type",
        "service_type",
        "vehicle_age",
        "kilometers_driven",
        "fuel_type",
        "engine_type",
        "previous_services"
    ]
    target_col = "actual_cost"

    X = df[feature_cols]
    y = df[target_col]

    categorical_features = ["vehicle_type", "service_type", "fuel_type", "engine_type"]
    numerical_features = ["vehicle_age", "kilometers_driven", "previous_services"]

    # 3. Preprocessor Construction
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features),
            ("num", StandardScaler(), numerical_features)
        ]
    )

    # 4. Pipeline with RandomForestRegressor
    model_pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("regressor", RandomForestRegressor(
                n_estimators=120,
                max_depth=16,
                min_samples_split=4,
                random_state=42,
                n_jobs=-1
            ))
        ]
    )

    # 5. Train / Test Split (80% Train, 20% Test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )
    print(f"📊 Training set: {len(X_train):,} samples | Test set: {len(X_test):,} samples")

    # 6. Fit Model
    print("⚙️  Training RandomForestRegressor model...")
    model_pipeline.fit(X_train, y_train)

    # 7. Evaluate Performance
    y_pred = model_pipeline.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))

    print("\n📈 Model Evaluation Results on Unseen Test Data:")
    print(f"  • R² Score (Accuracy): {r2 * 100:.2f}%")
    print(f"  • Mean Absolute Error: ₹{mae:.2f}")
    print(f"  • Root Mean Squared Error: ₹{rmse:.2f}")

    # 8. Save Artifacts
    os.makedirs(output_dir, exist_ok=True)
    model_path = os.path.join(output_dir, "service_cost_model.joblib")
    metrics_path = os.path.join(output_dir, "model_metrics.json")

    joblib.dump(model_pipeline, model_path)
    print(f"\n💾 Model successfully exported to: '{model_path}'")

    metrics_data = {
        "model_name": "RandomForestRegressor_v1",
        "r2_score": round(float(r2), 4),
        "r2_percentage": f"{r2 * 100:.2f}%",
        "mae_inr": round(float(mae), 2),
        "rmse_inr": round(float(rmse), 2),
        "training_samples": len(X_train),
        "test_samples": len(X_test),
        "features": feature_cols,
        "trained_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }

    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_data, f, indent=2)

    elapsed = time.time() - start_time
    print(f"✨ Training finished in {elapsed:.2f} seconds!")
    return metrics_data

if __name__ == "__main__":
    train_model()
