from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
from .database import Base

class discovery(Base):
    pass

class profile(Base):
    pass
