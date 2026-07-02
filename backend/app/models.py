"""SQLAlchemy models.

Define models here by subclassing Base. Tables are created automatically
on app startup via Base.metadata.create_all (see main.py) — no migrations
needed. Example:

    from sqlalchemy.orm import Mapped, mapped_column
    from .db import Base

    class Note(Base):
        __tablename__ = "notes"

        id: Mapped[int] = mapped_column(primary_key=True)
        text: Mapped[str]
"""

from .db import Base  # noqa: F401
