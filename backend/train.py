import os
import json
import time
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer, TransformedTargetRegressor
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import r2_score, mean_absolute_error, root_mean_squared_error, mean_absolute_percentage_error
from lightgbm import LGBMRegressor

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_DATA_PATH = os.path.join(BASE_DIR, "data", "vehicle_service_data.csv")
DEFAULT_OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")

def train_model(data_path=DEFAULT_DATA_PATH, output_dir=DEFAULT_OUTPUT_DIR):
    print("=" * 65)
    print("🚀 Starting ServiceWise LightGBM Model Training Pipeline")
    print("=" * 65)
    start_time = time.time()

    # 1. Load Dataset
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}. Please run generate_dataset.py first.")

    print(f"📥 Loading dataset from '{data_path}'...")
    df = pd.read_csv(data_path)
    print(f"✓ Loaded {len(df):,} records with {len(df.columns)} columns.")

    # 2. Features and Target separation
    categorical_features = [
        "vehicle_type",
        "brand_segment",
        "fuel_type",
        "engine_type",
        "service_type",
        "workshop_type",
        "city_tier",
        "service_history"
    ]
    numerical_features = ["vehicle_age", "kilometers_driven"]
    addon_features = [
        "addon_brake_pads",
        "addon_ac_service",
        "addon_battery",
        "addon_wheel_care",
        "addon_clutch",
        "addon_suspension"
    ]

    feature_cols = categorical_features + numerical_features + addon_features
    target_col = "actual_cost"

    X = df[feature_cols]
    y = df[target_col]

    # 3. Preprocessor Construction
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features),
            ("num", StandardScaler(), numerical_features),
            ("addons", "passthrough", addon_features)
        ]
    )

    # 4. LightGBM Base Regressor
    # Optimized hyperparameters for tabular pricing regression
    lgbm = LGBMRegressor(
        n_estimators=400,
        learning_rate=0.04,
        max_depth=9,
        num_leaves=45,
        subsample=0.85,
        colsample_bytree=0.85,
        random_state=42,
        n_jobs=-1,
        verbose=-1
    )

    # Wrap with TransformedTargetRegressor using log1p/expm1 for right-skewed pricing
    target_transformed_model = TransformedTargetRegressor(
        regressor=lgbm,
        func=np.log1p,
        inverse_func=np.expm1
    )

    model_pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("regressor", target_transformed_model)
        ]
    )

    # 5. Train / Test Split (80% Train, 20% Test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )
    print(f"📊 Training set: {len(X_train):,} samples | Test set: {len(X_test):,} samples")

    # 6. Fit Model
    print("⚙️  Training LightGBM Regressor with log-target transformation...")
    model_pipeline.fit(X_train, y_train)

    # 7. Evaluate Performance
    print("🔍 Evaluating model predictions on unseen test split...")
    y_pred = model_pipeline.predict(X_test)
    
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = root_mean_squared_error(y_test, y_pred)
    mape = mean_absolute_percentage_error(y_test, y_pred) * 100

    print("\n📈 LightGBM Benchmark Results on 20,000 Unseen Test Samples:")
    print(f"  • R² Score (Variance Explained): {r2 * 100:.2f}%")
    print(f"  • Mean Absolute Percentage Error (MAPE): {mape:.2f}%")
    print(f"  • Mean Absolute Error (MAE): ₹{mae:.2f}")
    print(f"  • Root Mean Squared Error (RMSE): ₹{rmse:.2f}")

    # 8. Save Artifacts
    os.makedirs(output_dir, exist_ok=True)
    model_path = os.path.join(output_dir, "service_cost_model.joblib")
    metrics_path = os.path.join(output_dir, "model_metrics.json")

    joblib.dump(model_pipeline, model_path)
    print(f"\n💾 Model successfully saved to: '{model_path}'")

    metrics_data = {
        "model_name": "LightGBM_Regressor_v2",
        "r2_score": round(float(r2), 4),
        "r2_percentage": f"{r2 * 100:.2f}%",
        "mape_percentage": f"{mape:.2f}%",
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
    print(f"✨ Training pipeline successfully completed in {elapsed:.2f} seconds!")
    return metrics_data

if __name__ == "__main__":
    train_model()
