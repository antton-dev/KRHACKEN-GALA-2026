from sqlmodel import SQLModel, create_engine, Session
from models import Player, Celebrity

sqlite_filename = "krhacken_gala_26.db"
sqlite_url = f"sqlite:///{sqlite_filename}"

engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
