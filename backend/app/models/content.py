"""
Tables for every part of the site that changes.

Two shapes only:

* **Collections** — ordered lists the site renders (products, services,
  milestones …). All share `SortableContent`, so ordering, timestamps and
  publish state work identically everywhere and the generic CRUD router can
  serve any of them.
* **Singletons** — one-row tables for content that is not a list (the CEO
  profile, contact details). Modelled as tables rather than a key/value blob
  so the columns stay typed and validated.

Free-form lists (a product's highlights, a role's requirements) are stored as
JSONB. They are always read and written whole, never queried into, so a
child table would add joins and migrations for nothing.
"""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )


class SortableContent(TimestampMixin):
    """Shared shape for every ordered collection."""

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    # Explicit rather than relying on insertion order: editors reorder content.
    position: Mapped[int] = mapped_column(Integer, default=0, nullable=False, index=True)
    # Lets a draft exist in the database without appearing on the site.
    published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


# --------------------------------------------------------------------------
# Collections
# --------------------------------------------------------------------------


class Product(SortableContent, Base):
    __tablename__ = "products"

    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    tagline: Mapped[str] = mapped_column(Text, default="", nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    category: Mapped[str] = mapped_column(String(60), nullable=False)
    status: Mapped[str] = mapped_column(String(40), nullable=False)
    initials: Mapped[str] = mapped_column(String(8), default="", nullable=False)
    external_url: Mapped[str] = mapped_column(String(400), default="#", nullable=False)
    screenshot: Mapped[str | None] = mapped_column(String(400), nullable=True)
    highlights: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)


class Service(SortableContent, Base):
    __tablename__ = "services"

    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    icon: Mapped[str] = mapped_column(String(60), default="", nullable=False)
    included: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)


class Sector(SortableContent, Base):
    __tablename__ = "sectors"

    title: Mapped[str] = mapped_column(String(160), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    icon: Mapped[str] = mapped_column(String(60), default="", nullable=False)


class Domain(SortableContent, Base):
    __tablename__ = "domains"

    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)


class CustomProject(SortableContent, Base):
    __tablename__ = "custom_projects"

    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    image: Mapped[str | None] = mapped_column(String(400), nullable=True)


class Milestone(SortableContent, Base):
    __tablename__ = "milestones"

    # "Aug 2025" -- a display label, not a date. Kept as text because the site
    # groups by exactly this string.
    year: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)


class Stat(SortableContent, Base):
    __tablename__ = "stats"

    label: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    value: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    suffix: Mapped[str] = mapped_column(String(8), default="", nullable=False)


class AchievementHighlight(SortableContent, Base):
    __tablename__ = "achievement_highlights"

    label: Mapped[str] = mapped_column(String(160), unique=True, nullable=False)
    value: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    suffix: Mapped[str] = mapped_column(String(8), default="", nullable=False)


class MonthlyStar(SortableContent, Base):
    __tablename__ = "monthly_stars"

    month: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    department: Mapped[str] = mapped_column(String(160), default="", nullable=False)


class Recognition(SortableContent, Base):
    __tablename__ = "recognitions"

    title: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)


class Value(SortableContent, Base):
    __tablename__ = "values_"

    title: Mapped[str] = mapped_column(String(160), unique=True, nullable=False)
    short_description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    long_description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    icon: Mapped[str] = mapped_column(String(60), default="", nullable=False)


class Reason(SortableContent, Base):
    """"Why choose us" — distinct from Value, which is "how we get better"."""

    __tablename__ = "reasons"

    title: Mapped[str] = mapped_column(String(160), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    icon: Mapped[str] = mapped_column(String(60), default="", nullable=False)


class InternReview(SortableContent, Base):
    __tablename__ = "intern_reviews"

    name: Mapped[str] = mapped_column(String(160), nullable=False)
    track: Mapped[str] = mapped_column(String(160), default="", nullable=False)
    cohort: Mapped[str] = mapped_column(String(60), default="", nullable=False)
    initials: Mapped[str] = mapped_column(String(8), default="", nullable=False)
    quote: Mapped[str] = mapped_column(Text, default="", nullable=False)
    # Mirrors the flag the site already uses to decide whether a quote is a
    # draft. Never default this to true in a migration or seed.
    quote_approved: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class Job(SortableContent, Base):
    __tablename__ = "jobs"

    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    department: Mapped[str] = mapped_column(String(120), default="", nullable=False)
    employment_type: Mapped[str] = mapped_column(String(40), default="part-time", nullable=False)
    location: Mapped[str] = mapped_column(String(160), default="Remote", nullable=False)
    location_type: Mapped[str] = mapped_column(String(40), default="Remote", nullable=False)
    posted_at: Mapped[str] = mapped_column(String(40), default="", nullable=False)
    summary: Mapped[str] = mapped_column(Text, default="", nullable=False)
    responsibilities: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    requirements: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    nice_to_have: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)


class Internship(SortableContent, Base):
    __tablename__ = "internships"

    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    track: Mapped[str] = mapped_column(String(120), default="", nullable=False)
    location: Mapped[str] = mapped_column(String(160), default="Remote", nullable=False)
    location_type: Mapped[str] = mapped_column(String(40), default="Remote", nullable=False)
    duration: Mapped[str] = mapped_column(String(60), default="", nullable=False)
    stipend: Mapped[str] = mapped_column(String(120), default="", nullable=False)
    posted_at: Mapped[str] = mapped_column(String(40), default="", nullable=False)
    summary: Mapped[str] = mapped_column(Text, default="", nullable=False)
    responsibilities: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    requirements: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)


class OrgSeat(SortableContent, Base):
    __tablename__ = "org_seats"

    abbr: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    # Null means the seat is real but nobody has been named to it yet, which
    # is what the site renders as "Seat unfilled".
    holder: Mapped[str | None] = mapped_column(String(160), nullable=True)
    # "spine" (single-report chain) or "branch" (the chiefs).
    tier: Mapped[str] = mapped_column(String(20), default="spine", nullable=False)


class CoreTeamPod(SortableContent, Base):
    __tablename__ = "core_team_pods"

    discipline: Mapped[str] = mapped_column(String(160), unique=True, nullable=False)
    stack: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)


class TechStackItem(SortableContent, Base):
    __tablename__ = "tech_stack"

    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)


class ClientLogo(SortableContent, Base):
    __tablename__ = "client_logos"

    name: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)


# --------------------------------------------------------------------------
# Singletons
# --------------------------------------------------------------------------


class CeoProfile(TimestampMixin, Base):
    __tablename__ = "ceo_profile"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    name: Mapped[str | None] = mapped_column(String(160), nullable=True)
    role: Mapped[str] = mapped_column(String(160), default="", nullable=False)
    photo: Mapped[str | None] = mapped_column(String(400), nullable=True)
    about: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    focus: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    quote: Mapped[str] = mapped_column(Text, default="", nullable=False)
    quote_approved: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class SiteContact(TimestampMixin, Base):
    __tablename__ = "site_contact"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    address_lines: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    address_query: Mapped[str] = mapped_column(Text, default="", nullable=False)
    emails: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    incubation_centres: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    socials: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)


class User(TimestampMixin, Base):
    """An editor. Created by the seed/CLI, never by a public endpoint."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
