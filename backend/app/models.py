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

from sqlalchemy import Column, String, Table

from .db import Base

# Sample table — safe to delete along with its route in main.py and the
# frontend /fruits page. Defined with SQLAlchemy Core (rather than an ORM
# class) so it needs no primary key; ORM models like the example above
# work just as well.
sample_fruits = Table(
    "sample_fruits",
    Base.metadata,
    Column("name", String, nullable=False),
    Column("color", String, nullable=False),
)
