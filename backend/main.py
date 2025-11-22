import os
import shutil
import zipfile
import tempfile
import uuid
from typing import List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware 

RESULTS_DIR = "results"
TEMP_DIR_BASE = tempfile.gettempdir()


def save_student_files(student_zip_path: str, assignment_id: str, student_id: str, allowed_extensions: List[str]) -> int:
    final_student_dir = os.path.join(RESULTS_DIR, assignment_id, student_id)
    os.makedirs(final_student_dir, exist_ok=True)
    
    temp_extract_dir = os.path.join(TEMP_DIR_BASE, f"temp_extract_{uuid.uuid4().hex}")
    os.makedirs(temp_extract_dir, exist_ok=True)
    saved_file_count = 0
    
    try:
        with zipfile.ZipFile(student_zip_path, 'r') as student_zip:
            student_zip.extractall(temp_extract_dir)
            
        for root, _, files in os.walk(temp_extract_dir):
            for file_name in files:
                file_ext = os.path.splitext(file_name)[1].lower()
                if file_ext in allowed_extensions:
                    source_path = os.path.join(root, file_name)
                    destination_path = os.path.join(final_student_dir, file_name)

                    os.makedirs(os.path.dirname(destination_path), exist_ok=True)
                    shutil.copy2(source_path, destination_path)
                    saved_file_count += 1
                    print(f"  -> Saved: {student_id}/{file_name}")
                    
    except Exception as e:
        print(f"Error processing and saving student {student_id}: {e}")
    finally:
        shutil.rmtree(temp_extract_dir, ignore_errors=True)
        
    return saved_file_count


app = FastAPI(title="Plagiarism Detector File Handler", description="Backend for handling nested ZIP uploads and setting up the file structure.", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if not os.path.exists(RESULTS_DIR):
    os.makedirs(RESULTS_DIR)

@app.get("/")
async def read_root():
    """Simple health check endpoint."""
    return {"message": f"Plagiarism Detector API is running. Files will be saved to the '{RESULTS_DIR}' directory."}


@app.post("/api/upload-assignment")
async def upload_assignment(assignment_file: UploadFile = File(...), assignment_name: str = Form(...), similarity_threshold: int = Form(...), allowed_extensions: str = Form(...), detection_mode: str = Form(...) ):
    assignment_id = str(uuid.uuid4())
    allowed_ext_list = [ext.strip().lower() for ext in allowed_extensions.split(',') if ext.strip()]
    
    temp_assignment_dir = os.path.join(TEMP_DIR_BASE, assignment_id)
    os.makedirs(temp_assignment_dir, exist_ok=True)
    master_zip_path = os.path.join(temp_assignment_dir, assignment_file.filename)
    
    total_files_saved = 0
    student_zip_paths = []
    
    try:
        print(f"Saving master zip to temporary location: {master_zip_path}")
        with open(master_zip_path, "wb") as buffer:
            shutil.copyfileobj(assignment_file.file, buffer)

        print(f"Starting extraction for assignment: {assignment_name} ({assignment_id})")
        with zipfile.ZipFile(master_zip_path, 'r') as master_zip:
            master_zip.extractall(temp_assignment_dir)
        for root, _, files in os.walk(temp_assignment_dir):
            for file_name in files:
                if file_name.lower().endswith('.zip') and file_name != assignment_file.filename:
                    student_zip_paths.append(os.path.join(root, file_name))
        
        if not student_zip_paths:
             raise ValueError("No nested student ZIP files found inside the main submission ZIP. Please ensure the main ZIP contains individual student ZIPs.")
        print(f"Found {len(student_zip_paths)} student ZIP files.")

        for student_zip_path in student_zip_paths:
            student_zip_name = os.path.basename(student_zip_path)
            student_id = os.path.splitext(student_zip_name)[0] 
            
            count = save_student_files(student_zip_path, assignment_id, student_id, allowed_ext_list)
            total_files_saved += count
            
        
        print(f"File handling COMPLETE for {assignment_id}. Total files saved: {total_files_saved}")
        
        return JSONResponse(content={
            "message": "Files successfully uploaded, extracted, and saved.",
            "assignment_id": assignment_id,
            "saved_to_path": os.path.join(RESULTS_DIR, assignment_id),
            "total_files_saved": total_files_saved
        })

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"Critical error during file processing: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error during file processing.")
    finally:
        if os.path.exists(temp_assignment_dir):
            shutil.rmtree(temp_assignment_dir, ignore_errors=True)