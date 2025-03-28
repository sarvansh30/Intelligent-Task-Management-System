from fastapi import APIRouter , Depends
from fastapi.security import OAuth2PasswordBearer
import jwt
from dotenv import load_dotenv
import os

from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
load_dotenv()

router = APIRouter(prefix='/todoapp', tags=["todoapp"])


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

SECRET_KEY= os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        # This call will check the "exp" claim by default.
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

@router.get('/')
async def getTodos(curr_user:str = Depends(get_current_user)):
    return {"msg":f"{curr_user}"}