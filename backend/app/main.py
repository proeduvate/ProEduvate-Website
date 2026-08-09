from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.models import content as m
from app.routers import auth, singletons
from app.routers.crud import build_crud_router
from app.schemas.factory import build_schemas

settings = get_settings()

app = FastAPI(
    title="ProEduvate Content API",
    version="0.1.0",
    description=(
        "Content store for the ProEduvate marketing site. Reads are public "
        "because the site is; every write requires a bearer token."
    ),
)

app.add_middleware(
    CORSMiddleware,
    # An explicit list, never "*": the API accepts credentials, and a
    # wildcard origin with credentials is exactly the combination browsers
    # refuse and that people work around by disabling security.
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API = "/api/v1"

# (model, url segment, singular name for schema/tag naming)
COLLECTIONS = [
    (m.Product, "products", "Product"),
    (m.Service, "services", "Service"),
    (m.Sector, "sectors", "Sector"),
    (m.Domain, "domains", "Domain"),
    (m.CustomProject, "custom-projects", "CustomProject"),
    (m.Milestone, "milestones", "Milestone"),
    (m.Stat, "stats", "Stat"),
    (m.AchievementHighlight, "achievement-highlights", "AchievementHighlight"),
    (m.MonthlyStar, "monthly-stars", "MonthlyStar"),
    (m.Recognition, "recognitions", "Recognition"),
    (m.Value, "values", "Value"),
    (m.Reason, "reasons", "Reason"),
    (m.InternReview, "intern-reviews", "InternReview"),
    (m.Job, "jobs", "Job"),
    (m.Internship, "internships", "Internship"),
    (m.OrgSeat, "org-seats", "OrgSeat"),
    (m.CoreTeamPod, "core-team", "CoreTeamPod"),
    (m.TechStackItem, "tech-stack", "TechStackItem"),
    (m.ClientLogo, "client-logos", "ClientLogo"),
]

app.include_router(auth.router, prefix=API)
app.include_router(singletons.router, prefix=API)

for model, segment, name in COLLECTIONS:
    create_schema, update_schema, read_schema = build_schemas(model, name)
    app.include_router(
        build_crud_router(
            model=model,
            create_schema=create_schema,
            update_schema=update_schema,
            read_schema=read_schema,
            prefix=segment,
            tag=name,
        ),
        prefix=API,
    )


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok"}
