from datetime import datetime
from fastapi import FastAPI, Query
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bson import ObjectId
from helper_ai_API import PriorityTask

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
    deadline:datetime
    priority:int

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
        todo['deadline']=todo['deadline'].isoformat()
        # print(todo) 
        serialized_todos.append(todo)
    # print(serialized_todos)
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

