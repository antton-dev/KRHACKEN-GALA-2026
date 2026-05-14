# Guess who is behind the Baby Boss filter

## techno
- **backend** 
    - Python
    - FastAPI
    - Sqlite
- **Frontend**
    - JS Vanilla
- **server / Deployement**
    - Docker

## Déploiement en local
L'application est conteneurisée dans un Docker. Avant de construire le docker, il faut penser à ajouter un fichier `.env` à la racine contenant les variables de credential de la page admin/doc.
```
ADMIN_USER = "username"
ADMIN_PASSWORD = "password"
```

Pour lancer le docker : `docker-compose up -d --build`

l'application se lance sur `localhost:8000` par défaut.

la page de documentation/administration se trouve sur `/docs` (protégée par mot de passe)

## Ajouter des images
Pour ajouter des images à deviner, ca se passe sur `/docs`, dans le endpoint `/api/admin/celebrity/create`. Il faut renseigner le nom de la personne et upload son image.