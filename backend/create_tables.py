"""
Creates every table from the models.

Alembic is in the dependency list for real migrations later; this is the
fast path for a fresh local database.

    python create_tables.py
"""

from app.core.database import Base, engine
from app.models import content  # noqa: F401  -- registers the tables on Base

if __name__ == "__main__":
    Base.metadata.create_all(engine)
    print(f"created {len(Base.metadata.tables)} tables:")
    for name in sorted(Base.metadata.tables):
        print(f"  {name}")
