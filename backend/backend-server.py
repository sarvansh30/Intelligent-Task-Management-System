from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bson import ObjectId

app= FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    title: str
    iscompleted:bool

MONGO_URL = "mongodb://localhost:27017"

client = AsyncIOMotorClient(MONGO_URL)
db=client.get_database("Todo-list")
tdData=db.get_collection("list")

# print(tdData)
@app.get('/todos')
async def getTodos():
    todos = await tdData.find().to_list(length=None) 
    serialized_todos = []
    for todo in todos: 
        todo['_id'] = str(todo['_id']) 
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
