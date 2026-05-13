from fastapi import FastAPI, Depends
from sqlmodel import Session, select, col
from contextlib import asynccontextmanager
from database import create_db_and_tables, get_session
from models import *
from pydantic import BaseModel
import random
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

class ScorePayload(BaseModel):
    name: str
    score: int



@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

app.mount("/image", StaticFiles(directory="image"), name="image")
app.mount("/static", StaticFiles(directory="../frontend"), name="static")

@app.post("/api/start")
def start_game(session: Session = Depends(get_session)): # Depends : automatically open and close database cleanly
    all_celebtrities = session.exec(select(Celebrity)).all()

    if len(all_celebtrities) < 13:
        return {"error": "pas assez de donnée pour générer une partie"}

    correct_answers = random.sample(all_celebtrities, 10)

    game = []

    for correct_answer in correct_answers :
        others = [c for c in all_celebtrities if c.id != correct_answer.id]

        wrong_answers = random.sample(others, 3)

        choices = [correct_answer.name] + [f.name for f in wrong_answers]

        random.shuffle(choices)


        game.append({
            "image": correct_answer.image,
            "expected_answer": correct_answer.name,
            "choices": choices
        })

    return game


@app.post("/api/score")
def save_score(payload: ScorePayload, session = Depends(get_session)):
    player = session.exec(select(Player).where(Player.name == payload.name)).first()

    if player : 
        if payload.score > player.best:
            player.best = payload.score
            session.add(player)
            session.commit()
            return {"message": "Meilleur score enregistré"}
        else:
            return {"message": "pas de nouveau record..."}
    else:
        new_player = Player(name=payload.name, best=payload.score)
        session.add(new_player)
        session.commit()
        return {"message": "Nouveau joueur est son score enregistré"}



@app.get("/api/leaderboard")
def get_board(session: Session = Depends(get_session)):
    query = select(Player).order_by(col(Player.best).desc())
    board = session.exec(query).all()

    return board


@app.get('/')
def index():
    return FileResponse("../frontend/index.html")


@app.get('/leaderboard')
def leaderboard():
    return FileResponse('../frontend/leaderboard.html')