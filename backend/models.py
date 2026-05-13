from sqlmodel import Field, SQLModel
from typing import Optional

class Player(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    best: int = Field(default=0)

class Celebrity(SQLModel, table=True):
    id : Optional[int] = Field(default=None, primary_key=True)
    name : str
    image : str


