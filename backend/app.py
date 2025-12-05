import os
import json
import numpy as np
from dotenv import load_dotenv
import torch
from transformers import BertForSequenceClassification, AutoTokenizer
from flask import Flask, request, jsonify
from flask_cors import CORS
import zipfile
import shutil
from pathlib import Path
from werkzeug.utils import secure_filename
from docx import Document


load_dotenv()
local_model_path = os.getenv("LOCAL_MODEL_PATH", "model/checkpoint-606")
debug_mode = os.getenv("FLASK_DEBUG", 'false').lower() in ('true', '1', 't')

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# File upload configuration
UPLOAD_FOLDER = 'uploads'
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_EXTENSIONS = {'.zip'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE
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
        max_score = max(sentence_scores) if sentence_scores else 0.0
        scores.append(max_score)
    overall_max_score = max(scores) if scores else 0.0
    average_score = np.mean(scores) if scores else 0.0
    
    return float(overall_max_score), float(average_score)


def extract_text_from_file(file_path: Path) -> str:
    """
    Extract text content from various file types.
    """
    suffix = file_path.suffix.lower()
    
    try:
        if suffix in ['.py', '.java', '.cpp', '.js', '.txt']:
            # Plain text files
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()
        
        elif suffix == '.docx':
            # Word documents
            doc = Document(file_path)
            return '\n'.join([paragraph.text for paragraph in doc.paragraphs])
        
        else:
            return ""
    
    except Exception as e:
        print(f"Error extracting text from {file_path}: {e}")
        return ""


def extract_zip(zip_path: Path, extract_to: Path, allowed_extensions: set) -> list[Path]:
    """
    Extract ZIP file and return list of files with allowed extensions.
    """
    extracted_files = []
    
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        
        for file_path in extract_to.rglob('*'):
            if file_path.is_file() and file_path.suffix.lower() in allowed_extensions:
                extracted_files.append(file_path)
        
        return extracted_files
    
    except Exception as e:
        print(f"Error extracting ZIP: {e}")
        return []


def compare_all_files(file_paths: list[Path], similarity_threshold: float) -> list[dict]:
    """
    Compare all files pairwise and return suspicious pairs.
    """
    results = []
    n = len(file_paths)
    
    for i in range(n):
        for j in range(i + 1, n):
            file1 = file_paths[i]
            file2 = file_paths[j]
            
            text1 = extract_text_from_file(file1)
            text2 = extract_text_from_file(file2)
            
            if not text1 or not text2:
                continue
            similarity = get_similarity_score(text1, text2)
            similarity_percent = similarity * 100
            if similarity_percent >= similarity_threshold:
                if similarity_percent >= 90:
                    status = "Identical"
                elif similarity_percent >= 75:
                    status = "Flagged"
                else:
                    status = "Suspicious"
                
                results.append({
                    "id": f"{i}_{j}",
                    "student1": file1.stem, 
                    "student2": file2.stem,
                    "similarity": round(similarity_percent, 2),
                    "status": status,
                    "matchedSentences": 0 
                })
    
    return results



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


@app.route("/upload-and-analyze", methods=["POST"])
def upload_and_analyze():
    """
    Handle ZIP file upload, extract files, and perform plagiarism analysis.
    """
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Get settings from form data
        assignment_name = request.form.get('assignmentName', 'Untitled')
        similarity_threshold = float(request.form.get('similarity', 70))
        
        # Parse file types to analyze
        file_types = request.form.get('fileTypes', '')
        allowed_file_extensions = set()
        if file_types:
            file_types_dict = json.loads(file_types)
            for ext, enabled in file_types_dict.items():
                if enabled:
                    allowed_file_extensions.add(f'.{ext}')
        
        # If no file types selected, use all supported types
        if not allowed_file_extensions:
            allowed_file_extensions = {'.py', '.java', '.cpp', '.js', '.txt', '.docx'}
        
        # Secure the filename
        filename = secure_filename(file.filename)
        
        # Create unique folder for this upload
        import uuid
        upload_id = str(uuid.uuid4())
        upload_path = Path(UPLOAD_FOLDER) / upload_id
        upload_path.mkdir(parents=True, exist_ok=True)
        
        # Save the ZIP file
        zip_path = upload_path / filename
        file.save(zip_path)
        
        # Extract ZIP
        extract_path = upload_path / 'extracted'
        extracted_files = extract_zip(zip_path, extract_path, allowed_file_extensions)
        
        if not extracted_files:
            # Cleanup
            shutil.rmtree(upload_path, ignore_errors=True)
            return jsonify({
                "error": "No valid files found in ZIP. Please check file types."
            }), 400
        
        if len(extracted_files) < 2:
            # Cleanup
            shutil.rmtree(upload_path, ignore_errors=True)
            return jsonify({
                "error": "Need at least 2 files to compare. Found only 1 file."
            }), 400
        
        # Compare all files
        suspicious_pairs = compare_all_files(extracted_files, similarity_threshold)
        
        # Calculate statistics
        total_submissions = len(extracted_files)
        avg_similarity = 0
        high_risk_count = 0
        
        if suspicious_pairs:
            avg_similarity = sum(p['similarity'] for p in suspicious_pairs) / len(suspicious_pairs)
            high_risk_count = len([p for p in suspicious_pairs if p['similarity'] >= 90])
        
        # Cleanup temp files
        shutil.rmtree(upload_path, ignore_errors=True)
        
        return jsonify({
            "success": True,
            "assignmentName": assignment_name,
            "totalSubmissions": total_submissions,
            "suspiciousPairs": suspicious_pairs,
            "statistics": {
                "totalPairs": len(suspicious_pairs),
                "avgSimilarity": round(avg_similarity, 2),
                "highRiskCount": high_risk_count
            }
        })
    
    except Exception as e:
        print(f"Upload error: {e}")
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