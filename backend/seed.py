"""
Loads backend/seed_data.json into the database.

    python seed.py                       # content only
    python seed.py --editor you@x.com    # content + an editor account

Idempotent: rows are matched on their natural key and updated in place, so
running it twice does not duplicate anything and a reseed after editing
data/ brings the database back in line.

It does **not** delete rows that have disappeared from the JSON. Content
created through the API is not in the export, and a seed script that wiped it
would be a data-loss trap the first time someone reseeded a live database.
Removals are deliberate and go through the API.
"""

import argparse
import json
import secrets
import sys
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, engine, Base
from app.core.security import hash_password
from app.models import content as m

SEED_FILE = Path(__file__).parent / "seed_data.json"

# collection key -> (model, natural key column)
COLLECTIONS = [
    ("products", m.Product, "slug"),
    ("services", m.Service, "slug"),
    ("sectors", m.Sector, "title"),
    ("domains", m.Domain, "name"),
    ("custom_projects", m.CustomProject, "slug"),
    ("milestones", m.Milestone, "title"),
    ("stats", m.Stat, "label"),
    ("achievement_highlights", m.AchievementHighlight, "label"),
    ("monthly_stars", m.MonthlyStar, "month"),
    ("recognitions", m.Recognition, "title"),
    ("values", m.Value, "title"),
    ("reasons", m.Reason, "title"),
    ("intern_reviews", m.InternReview, "name"),
    ("jobs", m.Job, "slug"),
    ("internships", m.Internship, "slug"),
    ("org_seats", m.OrgSeat, "abbr"),
    ("core_team", m.CoreTeamPod, "discipline"),
    ("tech_stack", m.TechStackItem, "name"),
    ("client_logos", m.ClientLogo, "name"),
]


def upsert_collection(db: Session, rows: list[dict], model: type, key: str) -> tuple[int, int]:
    created = updated = 0
    for position, row in enumerate(rows):
        existing = db.scalar(select(model).where(getattr(model, key) == row[key]))
        if existing is None:
            db.add(model(**row, position=position))
            created += 1
        else:
            for field, value in row.items():
                setattr(existing, field, value)
            existing.position = position
            updated += 1
    return created, updated


def upsert_singleton(db: Session, model: type, data: dict) -> None:
    row = db.get(model, 1)
    if row is None:
        db.add(model(id=1, **data))
    else:
        for field, value in data.items():
            setattr(row, field, value)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--editor", help="Create/refresh an editor account with this email")
    parser.add_argument("--password", help="Password for --editor (generated if omitted)")
    args = parser.parse_args()

    if not SEED_FILE.exists():
        print(
            f"{SEED_FILE.name} not found. Generate it first:\n"
            "  node --experimental-strip-types scripts/export-content.mjs",
            file=sys.stderr,
        )
        return 1

    Base.metadata.create_all(engine)
    payload = json.loads(SEED_FILE.read_text())

    with SessionLocal() as db:
        total_created = total_updated = 0
        for key, model, natural_key in COLLECTIONS:
            created, updated = upsert_collection(db, payload.get(key, []), model, natural_key)
            total_created += created
            total_updated += updated
            print(f"  {key:<24} +{created} ~{updated}")

        upsert_singleton(db, m.CeoProfile, payload["ceo"])
        upsert_singleton(db, m.SiteContact, payload["contact"])
        print(f"  {'ceo + contact':<24} singletons written")

        if args.editor:
            password = args.password or secrets.token_urlsafe(16)
            user = db.scalar(select(m.User).where(m.User.email == args.editor))
            if user is None:
                db.add(m.User(email=args.editor, hashed_password=hash_password(password)))
                action = "created"
            else:
                user.hashed_password = hash_password(password)
                action = "password reset"
            print(f"\neditor {action}: {args.editor}")
            if not args.password:
                print(f"password: {password}   <- shown once, store it now")

        db.commit()
        print(f"\ndone: {total_created} created, {total_updated} updated")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
