import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL= os.getenv("DATABASE_URL")
FRONTEND_URL=  os.getenv("FRONTEND_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in environment variables")

class Envs:
    DATABASE_URL: str = DATABASE_URL
    FRONTEND_URL: str = FRONTEND_URL
    
envs = Envs()