"""
One CRUD router, reused for every collection.

There are sixteen content collections and they differ only in their columns.
Hand-writing sixteen near-identical routers would mean sixteen places to fix
the next time pagination, ordering or the auth gate changes -- so the routes
are generated from the model and its schemas instead.

Every collection therefore behaves identically:

    GET    /api/v1/{name}            list, published only unless include_unpublished
    GET    /api/v1/{name}/{id}       one
    POST   /api/v1/{name}            create           (auth)
    PATCH  /api/v1/{name}/{id}       partial update   (auth)
    DELETE /api/v1/{name}/{id}       delete           (auth)
    POST   /api/v1/{name}/reorder    set positions    (auth)
"""

from typing import TypeVar

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_editor

ModelT = TypeVar("ModelT")


class ReorderRequest(BaseModel):
    """Ids in the order they should appear."""

    ids: list[int]


def build_crud_router(
    *,
    model: type,
    create_schema: type[BaseModel],
    update_schema: type[BaseModel],
    read_schema: type[BaseModel],
    prefix: str,
    tag: str,
) -> APIRouter:
    router = APIRouter(prefix=f"/{prefix}", tags=[tag])

    def get_or_404(db: Session, item_id: int):
        item = db.get(model, item_id)
        if item is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"{tag} {item_id} not found")
        return item

    @router.get("", response_model=list[read_schema])
    def list_items(
        db: Session = Depends(get_db),
        include_unpublished: bool = Query(
            False,
            description="Include drafts. The site should never set this.",
        ),
        limit: int = Query(200, ge=1, le=500),
        offset: int = Query(0, ge=0),
    ):
        stmt = select(model)
        if not include_unpublished:
            stmt = stmt.where(model.published.is_(True))
        stmt = stmt.order_by(model.position, model.id).limit(limit).offset(offset)
        return db.scalars(stmt).all()

    @router.get("/{item_id}", response_model=read_schema)
    def get_item(item_id: int, db: Session = Depends(get_db)):
        return get_or_404(db, item_id)

    @router.post("", response_model=read_schema, status_code=status.HTTP_201_CREATED)
    def create_item(
        payload: create_schema,  # type: ignore[valid-type]
        db: Session = Depends(get_db),
        _: str = Depends(require_editor),
    ):
        item = model(**payload.model_dump())
        db.add(item)
        try:
            db.commit()
        except IntegrityError as exc:
            db.rollback()
            # Almost always a duplicate slug/name. 409 is the honest status --
            # a 500 here would read as a server fault rather than bad input.
            raise HTTPException(
                status.HTTP_409_CONFLICT, f"{tag} violates a uniqueness constraint"
            ) from exc
        db.refresh(item)
        return item

    @router.patch("/{item_id}", response_model=read_schema)
    def update_item(
        item_id: int,
        payload: update_schema,  # type: ignore[valid-type]
        db: Session = Depends(get_db),
        _: str = Depends(require_editor),
    ):
        item = get_or_404(db, item_id)
        # exclude_unset is what makes this a real PATCH: without it every
        # omitted field would be overwritten with its default.
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(item, field, value)
        try:
            db.commit()
        except IntegrityError as exc:
            db.rollback()
            raise HTTPException(
                status.HTTP_409_CONFLICT, f"{tag} violates a uniqueness constraint"
            ) from exc
        db.refresh(item)
        return item

    @router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
    def delete_item(
        item_id: int,
        db: Session = Depends(get_db),
        _: str = Depends(require_editor),
    ):
        db.delete(get_or_404(db, item_id))
        db.commit()

    @router.post("/reorder", response_model=list[read_schema])
    def reorder(
        payload: ReorderRequest,
        db: Session = Depends(get_db),
        _: str = Depends(require_editor),
    ):
        found = db.scalars(select(model).where(model.id.in_(payload.ids))).all()
        by_id = {item.id: item for item in found}
        missing = [i for i in payload.ids if i not in by_id]
        if missing:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"unknown ids: {missing}")

        for position, item_id in enumerate(payload.ids):
            by_id[item_id].position = position
        db.commit()

        stmt = select(model).order_by(model.position, model.id)
        return db.scalars(stmt).all()

    return router
