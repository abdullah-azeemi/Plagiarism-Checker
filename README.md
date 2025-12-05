# Plagiarism Checker

A modern plagiarism detection application that uses AI-powered sentence transformers to analyze text similarity. Built with Next.js on the frontend and Flask on the backend.

## Features

- 🔍 **AI-Powered Analysis**: Uses sentence transformers for accurate semantic similarity detection
- 📊 **Visual Results**: Interactive similarity matrix and detailed comparison views
- 🚀 **Real-time Processing**: Upload and analyze documents with live progress tracking
- 🎨 **Modern UI**: Beautiful, responsive interface built with Next.js and shadcn/ui
- 🔒 **CORS Enabled**: Secure cross-origin resource sharing for API access

## Tech Stack

### Frontend
- **Framework**: Next.js 15+ with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Language**: TypeScript

### Backend
- **Framework**: Flask
- **ML Model**: Sentence Transformers (`all-MiniLM-L6-v2`)
- **Libraries**: PyTorch, NumPy
- **Language**: Python 3.14

## Project Structure

```
plagirism-check/
├── frontend/           # Next.js frontend application
│   ├── app/           # App router pages and components
│   ├── components/    # Reusable UI components
│   ├── lib/           # Utility functions
│   └── public/        # Static assets
└── backend/           # Flask backend API
    ├── app.py         # Main Flask application
    ├── model/         # Pre-downloaded ML model (gitignored)
    └── requirements.txt
```

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Git**

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python3 -m venv .venv
```

3. Activate the virtual environment:
```bash
# On macOS/Linux
source .venv/bin/activate

# On Windows
.venv\Scripts\activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Download the model (first run will auto-download):
```bash
python app.py
```

6. Run the Flask development server:
```bash
# For development (recommended)
python app.py

# Or use gunicorn with 1 worker (to avoid memory issues)
gunicorn -w 1 -b 0.0.0.0:5000 app:app
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

### `GET /`
Health check endpoint
- **Response**: `"Hello World"`

### `POST /analyze-paraphrase`
Analyzes text similarity between two documents
- **Request Body**:
  ```json
  {
    "text_a": "First text to compare",
    "text_b": "Second text to compare"
  }
  ```
- **Response**:
  ```json
  {
    "overall_max_score": 0.85,
    "average_score": 0.82
  }
  ```

## How It Works

1. **Upload**: Users upload documents for plagiarism analysis
2. **Preprocessing**: Documents are split into sentences
3. **Embedding**: Each sentence is converted to a vector embedding using the sentence transformer model
4. **Comparison**: Cosine similarity is calculated between all sentence pairs
5. **Results**: Similarity scores are visualized in an interactive matrix

## Memory Considerations

⚠️ **Important**: The sentence transformer model requires significant memory (~500MB per process).

- **Development**: Use `python app.py` (single process)
- **Production**: Use `gunicorn --preload -w 2` to share model memory across workers
- **Avoid**: Running multiple workers without `--preload` flag on machines with limited RAM

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
source .venv/bin/activate  # Activate virtual environment
python app.py
```

## Deployment

### Frontend
Deploy to Vercel (recommended):
```bash
cd frontend
vercel deploy
```

### Backend
Deploy to services like:
- Railway
- Render
- Heroku
- AWS/GCP/Azure

Remember to use `gunicorn --preload -w 2` for production deployments.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [Sentence Transformers](https://www.sbert.net/) for the pre-trained models
- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
