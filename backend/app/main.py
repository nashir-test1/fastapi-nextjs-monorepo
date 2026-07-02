import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from . import models  # noqa: F401  (ensures models are registered with Base)
from .db import Base, engine

logger = logging.getLogger("uvicorn.error")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables for any models defined in models.py (no-op if none).
    try:
        Base.metadata.create_all(engine)
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
