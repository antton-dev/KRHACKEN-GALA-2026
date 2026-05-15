FROM python:3.11-slim

WORKDIR /app

# Dépendances système minimales
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# On copie d'abord les requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# On copie TOUT le projet dans /app
COPY . .

# CRUCIAL : On déplace le dossier de travail dans backend pour que Uvicorn trouve "main"
WORKDIR /app/backend

# On expose le port de FastAPI
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]