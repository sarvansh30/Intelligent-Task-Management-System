from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
from fastapi import FastAPI, Query,Depends
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bson import ObjectId
from helper_ai_API import PriorityTask
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from jose import jwt, JWTError

load_dotenv()


app= FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
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
    

MONGO_URL = os.environ["MONGO_URL"]


client = AsyncIOMotorClient(MONGO_URL)
db=client.get_database("Todo-list")
tdData=db.get_collection("list")
userData=db.get_collection("Users")


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

SECRET_KEY = os.environ["SECRET_KEY"] 
ALGORITHM = os.environ["ALGORITHM"]
# ACCESS_TOKEN_EXPIRE_MINUTES = os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"]
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme=OAuth2PasswordBearer(tokenUrl="token")

def create_token(data:dict,exp_time:timedelta):
    to_encode=data.copy()
    if exp_time:
        expire=datetime.now()+exp_time
    else:
        expire =datetime.now() + timedelta(minutes=1)
     
    to_encode.update({"exp":expire})
    
    encoded_token=jwt.encode(to_encode,SECRET_KEY,ALGORITHM)
    return encoded_token

def get_current_user(token:str= Depends(oauth2_scheme)):
    payload=jwt.decode(token,SECRET_KEY,ALGORITHM)
    username:str=payload.get("username")
    return username


@app.post('/checkLogin')
async def checkLogin(userr:User):
    resp=await userData.find({"username":userr.username}).to_list(length=None)
    print(resp)
    if len(resp)!=0 and verifyPass(userr.password,resp[0]["password"]):
        access_token=create_token(userr.model_dump(),timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        

        return {"msg":"User logged in!!",
                "access_token":access_token,
                "token_type":"bearer"}
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

