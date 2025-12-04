from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


from app.config.env import envs

engine = create_engine(envs.DATABASE_URL)
SessionLocal = sessionmaker(
    autocommit= False,
    autoflush= False,
    bind=engine
)

def get_db():
    """
    Dependency that yields a database session and closes it after use.
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
            db.rollback()
            raise
    finally:
        db.close()