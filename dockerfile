# On utilise une version légère de Python
FROM python:3.11-slim

# Dossier de travail dans le conteneur
WORKDIR /app

# Copie des dépendances et installation
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie de tout le projet (backend et frontend)
COPY . .

# On se place dans le dossier backend pour lancer le serveur
WORKDIR /app/backend

# Port utilisé par FastAPI
EXPOSE 8000

# Commande de lancement (sans --reload pour la prod/test)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]