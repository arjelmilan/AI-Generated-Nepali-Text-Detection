import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables from a .env file if present.
load_dotenv()

# Read database connection string from environment, with a local default fallback.
DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://nepdetect:nepdetect_password@localhost:5432/nepdetect_db")

# Create the SQLAlchemy engine (core interface to the database).
engine = create_engine(DATABASE_URL)
# Session factory used to create DB sessions per request/task.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all ORM models.
Base = declarative_base()

def get_db():
    # Open a new database session.
    db = SessionLocal()
    try:
        # Provide the session to the caller.
        yield db
    finally:
        # Always close the session to avoid connection leaks.
        db.close()
        