"""
Builds Create / Update / Read schemas from a SQLAlchemy model.

Sixteen collections times three schemas is forty-eight classes that would
each restate columns already declared on the model. Every one of those is a
chance for the schema and the table to drift apart -- a renamed column that
still validates, a new field the API silently drops. Deriving them removes
that class of bug entirely.

The three differ only in which columns they expose and whether fields are
required:

* **Read**   — everything, including ids and timestamps.
* **Create** — writable columns; nullable/defaulted ones optional.
* **Update** — every writable column optional, so PATCH with
  ``exclude_unset`` only touches what the caller actually sent.
"""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, create_model
from sqlalchemy import inspect
from sqlalchemy.dialects.postgresql import JSONB

# Columns the server owns. A client must never set them.
_SERVER_OWNED = {"id", "created_at", "updated_at"}


def _python_type(column: Any) -> Any:
    # JSONB has no meaningful `python_type`; every JSONB column here holds a
    # list of strings or of small objects.
    if isinstance(column.type, JSONB):
        return list
    try:
        return column.type.python_type
    except NotImplementedError:
        return Any


def build_schemas(model: type, name: str) -> tuple[type[BaseModel], type[BaseModel], type[BaseModel]]:
    mapper = inspect(model)

    read_fields: dict[str, Any] = {}
    create_fields: dict[str, Any] = {}
    update_fields: dict[str, Any] = {}

    for column in mapper.columns:
        py = _python_type(column)
        optional = column.nullable
        read_type = (py | None) if optional else py
        read_fields[column.key] = (read_type, ...)

        if column.key in _SERVER_OWNED:
            continue

        # Optional on create when the database can supply a value itself.
        has_default = column.default is not None or column.server_default is not None
        if optional or has_default:
            create_fields[column.key] = (read_type, None)
        else:
            create_fields[column.key] = (read_type, ...)

        update_fields[column.key] = (py | None, None)

    config = ConfigDict(from_attributes=True)

    read = create_model(f"{name}Read", __config__=config, **read_fields)
    create = create_model(f"{name}Create", **create_fields)
    update = create_model(f"{name}Update", **update_fields)
    return create, update, read


__all__ = ["build_schemas", "datetime"]
