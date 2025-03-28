from fastapi import FastAPI


app= FastAPI()

from routers import auth,todos

app.include_router(auth.router)
app.include_router(todos.router)