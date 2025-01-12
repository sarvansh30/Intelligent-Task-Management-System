from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware

app= FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URL = "mongodb://localhost:27017"

client = AsyncIOMotorClient(MONGO_URL)
db=client.get_database("Todo-list")
tdData=db.get_collection("list")

# print(tdData)
@app.get('/todos')
async def getTodos():
    todos = await tdData.find().to_list(length=None)  # This returns a list of documents
    serialized_todos = []
    for todo in todos: 
        # todo['_id'] = str(todo['_id'])  
        serialized_todos.append(todo["todo"])
    return serialized_todos

@app.post('/addTDS')
async def addTDS(todo:str):

    await tdData.insert_one({"todo":todo})
    return {"message": "Todo added successfully"}
