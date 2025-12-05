# Dockerfile

FROM python:3.10-slim-bookworm

ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py
ENV PORT=8000
ENV MODEL_PATH=/app/models
ENV FLASK_ENV=production

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

# The Gunicorn command to start the application
# -w 4: 4 worker processes
# -b 0.0.0.0:${PORT}: Bind to the port set in the environment
# app:app: module:app instance
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]