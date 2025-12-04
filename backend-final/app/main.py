from fastapi import FastAPI

from app.middleware import setup_middleware
from app.routers import predict

#Initialize FastAPI
app = FastAPI()

setup_middleware(app)

app.include_router(predict.router, prefix="/api", tags=["predict"])

@app.get("/")
def root():
    return {"message": "Backend is running!"}