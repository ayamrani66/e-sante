from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Autorise Angular/Spring

# Charger modèles
model_binary = joblib.load("Models/model_binary.pkl")
model_type = joblib.load("Models/model_type.pkl")
model_risques = joblib.load("Models/model_risques.pkl")  # <- si dict, ça passe

@app.route("/predict", methods=["POST"])
def predict():
    raw_data = request.get_json()
    if raw_data["gender"] in ["Homme", "homme"]:
        raw_data["gender"] = "Male"
    elif raw_data["gender"] in ["Femme", "femme"]:
        raw_data["gender"] = "Female"

    # Mapping des noms venant de Spring/Angular vers ceux attendus par le modèle
    column_mapping = {
        "imc": "bmi",
        "tension": "hypertension",
        "glycemieajeun": "blood_glucose_level",
        "hba1c": "HbA1c_level",
        "tabac": "smoking_history",
        "sexe": "gender",
        "age": "age",
        "heart_disease": "heart_disease"
    }

    # Renommer les colonnes
    mapped_data = {column_mapping.get(k, k): v for k, v in raw_data.items()}

    # Créer DataFrame avec les bons noms
    df = pd.DataFrame([mapped_data])

    # 🔹 Prédiction diabète (binaire)
    pred_binary = model_binary.predict(df)[0]
    proba = model_binary.predict_proba(df)[0][1]

    result = {
        "diabetic": bool(pred_binary),
        "probability": float(proba),
        "type": None,
        "risks": {}
    }

    # 🔹 Si diabétique → prédire type
    if pred_binary == 1:
        result["type"] = int(model_type.predict(df)[0])

    # 🔹 Prédictions des risques (si ton pickle est bien un dict de modèles)
    if isinstance(model_risques, dict):
        for risque_name, model in model_risques.items():
            result["risks"][risque_name] = int(model.predict(df)[0])

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
