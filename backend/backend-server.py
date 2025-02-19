from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
from fastapi import FastAPI, Query
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bson import ObjectId
from helper_ai_API import PriorityTask
from passlib.context import CryptContext
# import 
import jwt

load_dotenv()
SECRET_KEY = os.environ["SECRET_KEY"] 
ALGORITHM = os.environ["ALGORITHM"]
ACCESS_TOKEN_EXPIRE_MINUTES = os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"]

app= FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_encrypt= CryptContext(
    schemes=["bcrypt"],
    default="bcrypt",
    bcrypt__rounds=13,
    deprecated="auto"
)

class Task(BaseModel):
    title: str
    iscompleted:bool
    deadline:datetime
    priority:int

class User(BaseModel):
    username:str
    password:str
MONGO_URL = "mongodb://localhost:27017"


client = AsyncIOMotorClient(MONGO_URL)
db=client.get_database("Todo-list")
tdData=db.get_collection("list")
userData=db.get_collection("Users")

def create_token(data:dict):
    toEncode=data.copy()
    expire= datetime.now(timezone.utc) +timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    toEncode.update({"exp":expire})
    return jwt.encode(toEncode,SECRET_KEY,algorithim=ALGORITHM)

@app.post('/userSignUp')
async def SignUp(userr:User):
    resp=await userData.find({"username":userr.username}).to_list(length=None)
    print(resp)
    if len(resp)==0:
        hashed_pass=pwd_encrypt.hash(userr.password)
        await userData.insert_one({"username":userr.username,"password":hashed_pass})
        print(hashed_pass)
        return True
    else:
        return False

def verifyPass(password:str,hashed_pass:str)->bool:
    return pwd_encrypt.verify(password,hashed_pass)

@app.post('/checkLogin')
async def checkLogin(userr:User):
    resp=await userData.find({"username":userr.username}).to_list(length=None)
    print(resp)
    if len(resp)!=0 and verifyPass(userr.password,resp[0]["password"]):
        return {"msg":"User logged in!!"}
    else:
        return {"error":"wrong username or password "}
        
# print(tdData)
@app.get('/todos')
async def getTodos():
    todos = await tdData.find().to_list(length=None) 
    serialized_todos = []
    for todo in todos: 
        todo['_id'] = str(todo['_id']) 
        todo['deadline']=todo['deadline'].isoformat()
        # print(todo) 
        serialized_todos.append(todo)
    print(serialized_todos)
    return serialized_todos

@app.post('/addTDS')
async def addTDS(todoTitle:Task):
    print(todoTitle)
    await tdData.insert_one(todoTitle.model_dump())
    return {"message": "Todo added successfully"}

@app.delete('/deleteTD')
async def deleteTD(_id:str):
    print(_id)
    await tdData.delete_one({"_id":ObjectId(_id)})
    return {"message":"Todo deleted successfully"}


@app.put('/updateTD/')
async def updateTD(_id:str,iscompleted:bool=Query(...)):
    print(_id)

    await tdData.update_one({"_id":ObjectId(_id)},
    {"$set":{"iscompleted":not iscompleted}})
    return{"message":"TODO update successfully"}

@app.get('/helper-ai-priority')
async def HelperAI_priority():
    tasks=await getTodos()
    taskss=PriorityTask(tasks)
    print(taskss["tasks"])

    for todo in taskss["tasks"]:
        await tdData.update_one({"_id":ObjectId(todo["_id"])},
                                {"$set":{"priority":todo["priority"]}})

    return {"message":"successfull"}    

