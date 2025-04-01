from pydantic import BaseModel, Field
from datetime import datetime, timezone, timedelta
from typing import Annotated, Optional

class User(BaseModel):
    username:str
    # name:str
    password:str


class Todos(BaseModel):
    title:str
    deadline: Annotated[datetime | None,Field(gt=datetime.now(tz=timezone.utc),default=datetime.now(tz=timezone.utc) + timedelta(days=1))] 
    isCompleted: Optional[bool] = False
    priority:Optional[int] = 0
    createdOn:Optional[datetime] = datetime.now(tz=timezone.utc)
    owner: Optional[str]=None

class Token(BaseModel):
    access_token:str
    token_tupe:str

class TokenData(BaseModel):
    username:str | None=None

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    deadline: Annotated[Optional[datetime], Field(gt=datetime.now(tz=timezone.utc))] = None
    iscompleted: Optional[bool] = False
    priority: Optional[int] = None
