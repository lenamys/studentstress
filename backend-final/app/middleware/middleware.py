from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.env import envs

def setup_middleware(app: FastAPI):
    """
    Configure all middleware for the FastAPI application.
    """
    
    frontend_origins = envs.FRONTEND_URL
    if not frontend_origins:
        raise ValueError("FRONTEND_URL environment variable is not set")
    
    
    #CORS Middleware to connect to frontend
    app.add_middleware(
        CORSMiddleware,
        allow_origins= frontend_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )