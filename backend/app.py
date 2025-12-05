import os
import json
import numpy as np
from dotenv import load_dotenv
import torch
from transformers import BertForSequenceClassification, AutoTokenizer
from flask import Flask, request, jsonify
from flask_cors import CORS


load_dotenv()
local_model_path = os.getenv("LOCAL_MODEL_PATH", "model/checkpoint-606")
debug_mode = os.getenv("FLASK_DEBUG", 'false').lower() in ('true', '1', 't')

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
print("Loading the model from the directory:", local_model_path)

try:
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    model = BertForSequenceClassification.from_pretrained(local_model_path)
    model.to(device)
    model.eval() 
    tokenizer = AutoTokenizer.from_pretrained(local_model_path)
    print("Model loaded successfully")

except Exception as e:
    print("Error loading model:", e)
    print("\nTrying to load from parent model directory...")
    try:
        parent_model_path = os.path.dirname(local_model_path)
        model = BertForSequenceClassification.from_pretrained(parent_model_path)
        model.to(device)
        model.eval()
        tokenizer = AutoTokenizer.from_pretrained(parent_model_path)
        print("Model loaded successfully from parent directory")
    except Exception as e2:
        print("Error loading from parent directory:", e2)
        exit(1)


def get_similarity_score(text_a: str, text_b: str) -> float:
    """
        Use BERT classification model to predict if two texts are similar.
        Returns probability that they are plagiarized (similar).
    """
    if not text_a or not text_b:
        return 0.0

    inputs = tokenizer(text_a, text_b, return_tensors="pt", padding=True, truncation=True, max_length=512)
    inputs = {k: v.to(device) for k, v in inputs.items()}
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
    probabilities = torch.softmax(logits, dim=1)
    similarity_score = probabilities[0][1].item()
    return similarity_score


def get_sentence_similarity_score(text_a: str, text_b: str) -> tuple[float, float]:
    """
        Compare two texts sentence by sentence and return similarity scores.
    """
    if not text_a or not text_b:
        return 0.0, 0.0
    
    sentences_1 = [s.strip() for s in text_a.split(".") if s.strip()]
    sentences_2 = [s.strip() for s in text_b.split(".") if s.strip()]
    if not sentences_1 or not sentences_2:
        return 0.0, 0.0
    scores = []
    
    for s1 in sentences_1:
        sentence_scores = []
        for s2 in sentences_2:
            score = get_similarity_score(s1, s2)
            sentence_scores.append(score)
            # gets the maximum similarity score for this sentence from text_a
        max_score = max(sentence_scores) if sentence_scores else 0.0
        scores.append(max_score)
    overall_max_score = max(scores) if scores else 0.0
    average_score = np.mean(scores) if scores else 0.0
    
    return float(overall_max_score), float(average_score)


@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "status": "ok",
        "message": "Plagiarism Detection API",
        "model": local_model_path,
        "device": str(device)
    })


@app.route("/analyze-paraphrase", methods=["POST"])
def analyze_paraphrase():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    try:
        data = request.get_json()
        text_a = data.get("text_a")
        text_b = data.get("text_b")
        if not text_a or not text_b:
            return jsonify({"error": "Missing text_a or text_b"}), 400
        
        overall_max_score, average_score = get_sentence_similarity_score(text_a, text_b)
        
        return jsonify({
            "overall_max_score": overall_max_score,
            "average_score": average_score,
            "interpretation": {
                "overall_max": "highest similarity between any sentence pair",
                "average": "average similarity across all sentence pairs from text_a"
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/analyze-simple", methods=["POST"])
def analyze_simple():
    """
        Simple endpoint that compares two texts as a whole.
    """
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    try:
        data = request.get_json()
        text_a = data.get("text_a")
        text_b = data.get("text_b")
        
        if not text_a or not text_b:
            return jsonify({"error": "Missing text_a or text_b"}), 400
        
        similarity_score = get_similarity_score(text_a, text_b)
        
        return jsonify({
            "similarity_score": similarity_score,
            "is_plagiarized": similarity_score > 0.5,
            "interpretation": "probability that text_b is plagiarized from text_a"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/health", methods=["GET"])
def health():
    if model is None:
        return jsonify({
            "status": "error",
            "message": "Model failed to load"
        }), 503

    return jsonify({
        "status": "ok",
        "message": "Model loaded successfully",
        "device": str(model.device)
    }), 200


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(debug=debug_mode, host="0.0.0.0", port=port)