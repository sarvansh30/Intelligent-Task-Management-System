from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app= FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"],    
)

from routers import auth,todos

app.include_router(auth.router)
app.include_router(todos.router)