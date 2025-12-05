import os
import json
import numpy as np
import torch
from sentence_transformers import SentenceTransformer, util
from flask import Flask, request, jsonify

app = Flask(__name__)
model = SentenceTransformer('all-MiniLM-L6-v2') # TODO: change this
try:
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    tokenizer = SentenceTransformer('all-MiniLM-L6-v2').tokenizer
    model = SentenceTransformer('all-MiniLM-L6-v2').to(device)
    print("Model loaded successfully")


except Exception as e:
    print("Error loading model:", e)
    exit(1)

def get_sentence_similarity_score(text_a: str, text_b: str) -> tuple[float, float]:
    if not text_a or not text_b:
        return 0.0, 0.0
    
    # 1. Split the sentences
    sentences_1 = text_a.split(".")
    sentences_2 = text_b.split(".")
    
    sentences_1 = [s.strip() for s in sentences_1 if s.strip()]
    sentences_2 = [s.strip() for s in sentences_2 if s.strip()]

    # 2. embed the sentences
    embeddings_1 = model.encode(sentences_1, convert_to_tensor=True)
    embeddings_2 = model.encode(sentences_2, convert_to_tensor=True)
    
    # 3 . calculate the similairty scores 
    cosine_scores = util.cos_sim(embeddings_1, embeddings_2)

    # 4. calculate the max scores for s1 and s2
    max_scores_for_s1 = torch.max(cosine_scores, dim=1).values
    overall_max_score = torch.max(max_scores_for_s1).item()

    average_score = torch.mean(max_scores_for_s1).item()
    return overall_max_score, average_score

@app.route("/", methods=["GET"])
def index():
    return "Hello World"

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
        return jsonify({"overall_max_score": overall_max_score, "average_score": average_score})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)