from fastapi import APIRouter, Depends, HTTPException, status, Query, Body, FastAPI
from fastapi.security import OAuth2PasswordBearer
import jwt
from dotenv import load_dotenv
import os
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from typing import List
from .schemas import Todos,TodoUpdate
from datetime import datetime, timedelta, timezone
from bson import ObjectId
from .helper_AI import PriorityTask,PlanMyDay, getTaskHelp
from fastapi.responses import StreamingResponse
load_dotenv()

router = APIRouter(prefix='/todoapp', tags=["todoapp"])


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

SECRET_KEY= os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")
DATABASE_URL=os.getenv('MONGO_URL')
client = AsyncIOMotorClient(DATABASE_URL)
database = client.get_database('Todo-list')
tdData=database.get_collection('list')

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
       
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
        return username
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    
def serialize(todo:Todos):
    if todo:
        todo["_id"] = str(todo["_id"])
        todo["deadline"]=  todo["deadline"].isoformat()
        todo["createdOn"] = todo["createdOn"].isoformat()

    return todo


@router.get('/')
async def getTodos(curr_user:str = Depends(get_current_user)):

    cursor=tdData.find({"owner":curr_user})
    todos=await cursor.to_list(length=None)
    serialized_todos=[serialize(todo) for todo in todos]
    return serialized_todos

@router.post('/addTodo')
async def addTodo(data:Todos , curr_user:str=Depends(get_current_user)):
    dataDict=data.model_dump()
    dataDict["owner"]=curr_user

    try:
        await tdData.insert_one(dataDict)
    except Exception as e:
        print(f"Exception occured: {e}")
        raise HTTPException(status_code=400, detail="couldn't process it")
    else:
        return {"msg":"Todo Added"}

       
@router.delete('/deleteTodo')
async def deletTodo(_id:str , curr_user:str=Depends(get_current_user)):

    try:
        await tdData.delete_one({"_id":ObjectId(_id)})
    except Exception as e:
        print(f"Exception occured: {e}")
        raise HTTPException(status_code=401,detail=f"An error occurred deleting the todo: {e}")
    else:
        return {"msg":"Todo deleted"}

@router.put("/updateTodo")
async def updateTodo(_id:str, todoStatus:bool , curr_user:str=Depends(get_current_user)):

    try:
        await tdData.update_one({"_id":ObjectId(_id)},
                                {"$set":{"isCompleted":not todoStatus}})
    
    except Exception as e:
        print(f"Exception {e} occured.")
        raise HTTPException(status_code=401,detail=f"Exception: {e}")
    else:
        return{"msg":"Todo Status Updated"}
