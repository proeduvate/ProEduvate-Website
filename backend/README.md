# ProEduvate Content API

FastAPI + PostgreSQL store for everything on the marketing site that changes.
Reads are public because the site is public; **every write requires a bearer
token.**

The site does **not** consume this yet — it still renders from `data/*.ts`.
This branch adds the backend; wiring the frontend to it is a separate change.

## Running it

```bash
cd backend
uv venv --python 3.13
uv pip install -e .
cp .env.example .env          # then fill in DATABASE_URL and JWT_SECRET
```

`JWT_SECRET` has no default and must be at least 32 characters — the app
refuses to start without one rather than booting with a fallback that would
end up signing real tokens:

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Create the database, then run the migrations:

```bash
createdb proeduvate-website
alembic upgrade head
```

Alembic is the only way the schema is created. `seed.py` deliberately does
not create tables: doing so would put them outside Alembic's control, leaving
`alembic_version` empty while the tables existed, and the next
`alembic upgrade head` would try to create them again and fail. The seeder
checks the schema is there and tells you to migrate if it is not.

## Seeding

The database is seeded from the site's own data files, so it starts as an
exact copy of what the site renders rather than retyped content that would
quietly disagree with it.

```bash
# from the repo root — regenerates backend/seed_data.json
node --experimental-strip-types scripts/export-content.mjs

# from backend/
python seed.py --editor you@proeduvate.in
```

The seed is idempotent: rows are matched on their natural key and updated in
place. It **never deletes** rows missing from the JSON — content created
through the API is not in the export, and a seed that wiped it would be a
data-loss trap on the first reseed of a live database.

Omit `--password` and one is generated and printed once.

### Migrations

```bash
alembic revision --autogenerate -m "what changed"   # after editing models/
alembic upgrade head
alembic downgrade -1
alembic current
alembic check      # fails if models and migrations have drifted
```

`migrations/env.py` reads the URL from the app settings rather than
`alembic.ini`, so migrations and the app can never point at different
databases and the password stays out of a tracked file.

Autogenerating against a database that already has the tables produces an
empty migration -- it diffs against what is *there*, not against nothing. Do
it against a scratch database:

```bash
createdb alembic-scratch
DATABASE_URL=postgresql+psycopg://proeduvate:proeduvate@localhost:5432/alembic-scratch \
  alembic revision --autogenerate -m "..."
dropdb alembic-scratch
```

For an existing database whose tables already match the models, `alembic
stamp head` records the revision without re-running the DDL.

## Serving

```bash
uvicorn app.main:app --reload --port 8123
```

Interactive docs at `/docs`.

## API shape

Nineteen collections all behave identically, because they are generated from
one router rather than hand-written:

```
GET    /api/v1/{collection}            list (published only by default)
GET    /api/v1/{collection}/{id}       one
POST   /api/v1/{collection}            create            (auth)
PATCH  /api/v1/{collection}/{id}       partial update    (auth)
DELETE /api/v1/{collection}/{id}       delete            (auth)
POST   /api/v1/{collection}/reorder    set positions     (auth)
```

Collections: `products` `services` `sectors` `domains` `custom-projects`
`milestones` `stats` `achievement-highlights` `monthly-stars` `recognitions`
`values` `reasons` `intern-reviews` `jobs` `internships` `org-seats`
`core-team` `tech-stack` `client-logos`

Singletons — one record, no list or delete:

```
GET    /api/v1/ceo        PATCH /api/v1/ceo        (auth)
GET    /api/v1/contact    PATCH /api/v1/contact    (auth)
```

Auth:

```
POST /api/v1/auth/token   # form: username, password -> bearer token
GET  /api/v1/auth/me
```

### Conventions worth knowing

- **`PATCH` is genuinely partial.** Omitted fields keep their values; only
  what you send is written.
- **`published: false` hides a row** from the default list without deleting
  it. Pass `?include_unpublished=true` to see drafts — the site should never
  set that.
- **`position` controls order.** Use `/reorder` with ids in the order you
  want rather than patching positions one at a time.
- **Duplicate natural keys return `409`**, not `500`. It is bad input, not a
  server fault.
- **`quote_approved` on `intern-reviews` and `ceo` gates whether a quote is
  shown at all.** It exists so a drafted quote never reads as a real person's
  words. Do not flip it to `true` in bulk.

## Example

```bash
API=http://localhost:8123/api/v1
TOKEN=$(curl -s -X POST $API/auth/token \
  -d "username=you@proeduvate.in&password=..." | jq -r .access_token)

curl -s $API/products | jq '.[0]'

curl -s -X PATCH $API/products/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"status":"Live"}'
```

## Tests

```bash
python -m pytest tests -q
```

They run against the configured Postgres and clean up after themselves,
deliberately rather than against SQLite — the JSONB columns are exactly what
a dialect swap would fail to catch.

## Notes

- Passwords are hashed with `bcrypt` directly. `passlib` is unmaintained
  (last release 2020) and its backend probe is broken against bcrypt ≥ 4.1.
  bcrypt ignores input past 72 bytes, so over-length passwords are **rejected**
  rather than silently truncated — truncation would let two different long
  passwords sharing a prefix authenticate each other.
- CORS uses an explicit origin list, never `*`. The API allows credentials,
  and browsers reject wildcard-plus-credentials — the usual "fix" for which is
  to turn the protection off.
- Schema changes go through Alembic only. There is deliberately no second
  path -- two ways to create tables is what leaves a database with the right
  tables and no revision recorded.

## Consuming it from the site

`NEXT_PUBLIC_API_URL` in the Next app's `.env.local` points at this API:

```
NEXT_PUBLIC_API_URL=http://localhost:8123
```

**Leave it unset and the site renders entirely from `data/*.ts`.** That is
the intended behaviour, not a degraded mode: the static files stay in the
repo as the floor and the API is an override on top of them, so a backend
that is down cannot take the marketing site with it.

`lib/api.ts` is fail-soft — a non-2xx, a timeout (2.5s) or an unreachable
host all return null and the caller uses the static copy. An empty array
counts as a failure too: a collection the site renders is never legitimately
empty, and an empty seed would otherwise blank a whole section.

`lib/content.ts` holds one accessor per collection. They are async and must
be called from Server Components, so the browser never waits on the API and
the content is in the initial HTML. Responses are cached for 60 seconds —
editorial content does not change per request, and it means a brief API
outage is invisible.

### Wiring a section

The products page is the worked example:

1. The page becomes `async` and calls the accessor.
2. The section takes the data as a prop instead of importing from `data/`.
3. The static import stays as the fallback inside `lib/content.ts`.

```tsx
export default async function ProductsPage() {
  const products = await getProductsByStatus();
  return <ProductsScrollStory products={products} />;
}
```
