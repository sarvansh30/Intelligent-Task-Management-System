from .schemas import User, Todos
from fastapi import APIRouter,Depends,HTTPException,status
from dotenv import load_dotenv
import os
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from typing import Annotated

import jwt
from jwt.exceptions import InvalidTokenError
from fastapi.security import OAuth2PasswordRequestForm

from datetime import datetime, timedelta, timezone
load_dotenv(override=True)
# setting up router
router = APIRouter(prefix='/auth',tags=['auth'])

#database setup
DATABASE_URL=os.getenv('MONGO_URL')
client = AsyncIOMotorClient(DATABASE_URL)
database = client.get_database('Todo-list')
userDB=database.get_collection('Users')

# defining hashing context
pwd_context= CryptContext(schemes=["bcrypt"],bcrypt__rounds=13,deprecated="auto") 


def hash_pass(pass1:str):
    return pwd_context.hash(pass1)

@router.post('/signup')
async def signup(user:User):

    userPresent = await userDB.find_one({"username":user.username})
    if userPresent:
        print("Username already in use try a different username")
    else:
        try:
            hashedPass=hash_pass(user.password)
            await userDB.insert_one({"username":user.username,
                                     "password":hashedPass})
        except Exception as e:
            print(e)
        else: print("new user created succesfully")

    


# Helping functions
def verifyPassword(pass1:str,pass2:str)->bool:
    return pwd_context.verify(pass1,pass2)

SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHIM=os.getenv("ALGORITHM")
def createToken(data:dict,exp:timedelta | None=None):
    toEncode=data.copy()
    if exp:
        expireTime=datetime.now(timezone.utc)+exp
    else:
        expireTime=datetime.now(timezone.utc)+ timedelta(minutes=1)
    toEncode.update({"exp":expireTime})

    token=jwt.encode(toEncode,SECRET_KEY,ALGORITHIM)
    return token

#routes setup
# @router.post('/login')
# async def checkLogin(user:Annotated[OAuth2PasswordRequestForm,Depends()]):
#     userPresent=await userDB.find_one({"username":user.username})
#     print(userPresent)
#     if not userPresent:
#         print("Username doesn't exist")
#     else:
#         checkPass=verifyPassword(user.password,userPresent['password'])
#         if not checkPass:
#             print("Passwords didn't match")
#             return
        
#     access_token=createToken({"sub":user.username},timedelta(minutes=20))
#     return {"access_token": access_token, "token_type": "bearer"}
        

    
@router.post("/login")
async def check_login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    # 1) Look up the user
    user_record = await userDB.find_one({"username": form_data.username})
    if not user_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2) Verify the password
    if not verifyPassword(form_data.password, user_record["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3) Create and return the token
    access_token=createToken({"sub":form_data.username},timedelta(minutes=20))
    return {"access_token": access_token, "token_type": "bearer"}
    
        