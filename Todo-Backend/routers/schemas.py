from pydantic import BaseModel, Field
from datetime import datetime
from typing import Annotated


class User(BaseModel):
    username:str
    # name:str
    password:str


class Todos(BaseModel):
    title:str
    deadline: Annotated[datetime | None,Field(gt=datetime.now())]
    isCompleted: bool
    priority:int
    createdOn:datetime=datetime.now()

class Token(BaseModel):
    access_token:str
    token_tupe:str

class TokenData(BaseModel):
    username:str | None=None