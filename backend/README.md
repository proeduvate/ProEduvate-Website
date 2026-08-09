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

Create the database, then the tables:

```bash
createdb proeduvate-website
python create_tables.py
```

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
- `create_tables.py` is the fast path for a fresh database. Alembic is
  installed for real migrations once the schema starts changing under data.
