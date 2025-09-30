from fastapi import FastAPI
from .database import engine, Base
from .features import discovery, profile

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(discovery.router)
app.include_router(profile.router)