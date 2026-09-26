import logging
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import insert, select, text
from sqlalchemy.orm import Session

from .db import Base, engine, get_db
from .models import sample_fruits

logger = logging.getLogger("uvicorn.error")

SEED_FRUITS = [
    {"name": "Apple", "color": "red"},
    {"name": "Banana", "color": "yellow"},
    {"name": "Kiwi", "color": "green"},
    {"name": "Blueberry", "color": "blue"},
    {"name": "Plum", "color": "purple"},
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables for any models defined in models.py, and seed the
    # sample table if it's empty.
    try:
        Base.metadata.create_all(engine)
        with engine.begin() as conn:
            if conn.execute(select(sample_fruits).limit(1)).first() is None:
                conn.execute(insert(sample_fruits), SEED_FRUITS)
    except Exception:
        logger.warning(
            "Could not connect to Postgres — is it running? Start it with: docker compose up -d"
        )
    yield


app = FastAPI(title="Interview Backend", lifespan=lifespan)

# The frontend dev server runs on a different origin, so allow it explicitly.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4321"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        database = "ok"
    except Exception as exc:
        database = f"error: {exc.__class__.__name__}"
    return {"status": "ok", "database": database}


@app.get("/fruits")
def list_fruits(db: Session = Depends(get_db)):
    rows = db.execute(select(sample_fruits)).mappings().all()
    return [dict(row) for row in rows]


# NAS-112: harmless watched-source push for selective rebuild evidence.


@app.get("/")
def root_health():
    return {"status": "ok"}
