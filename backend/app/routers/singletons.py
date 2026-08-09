"""
Routes for the one-row tables (CEO profile, contact details).

These are not collections, so the generic CRUD router does not fit: there is
nothing to list, create or delete, only a single record to read and update.
The row is created on first read if it is missing, so a fresh database serves
sensible empty content instead of a 404 the site would have to special-case.
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_editor
from app.models.content import CeoProfile, SiteContact
from app.schemas.factory import build_schemas

_, CeoUpdate, CeoRead = build_schemas(CeoProfile, "Ceo")
_, ContactUpdate, ContactRead = build_schemas(SiteContact, "Contact")

router = APIRouter(tags=["singletons"])


def _get_or_create(db: Session, model: type):
    row = db.get(model, 1)
    if row is None:
        row = model(id=1)
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


def _build(path: str, model: type, update_schema: type[BaseModel], read_schema: type[BaseModel]):
    @router.get(f"/{path}", response_model=read_schema, name=f"get_{path}")
    def read(db: Session = Depends(get_db)):
        return _get_or_create(db, model)

    @router.patch(f"/{path}", response_model=read_schema, name=f"update_{path}")
    def update(
        payload: update_schema,  # type: ignore[valid-type]
        db: Session = Depends(get_db),
        _: str = Depends(require_editor),
    ):
        row = _get_or_create(db, model)
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(row, field, value)
        db.commit()
        db.refresh(row)
        return row


_build("ceo", CeoProfile, CeoUpdate, CeoRead)
_build("contact", SiteContact, ContactUpdate, ContactRead)
