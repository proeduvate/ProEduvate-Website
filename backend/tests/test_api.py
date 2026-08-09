"""
API behaviour tests.

These run against the configured database and clean up after themselves, so
they exercise the real Postgres types (JSONB especially) rather than a SQLite
stand-in that would not catch a dialect mismatch.
"""

import secrets

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.main import app
from app.models.content import User

API = "/api/v1"
PASSWORD = "test-password-123"


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="module")
def editor_email():
    email = f"test-{secrets.token_hex(6)}@example.com"
    with SessionLocal() as db:
        db.add(User(email=email, hashed_password=hash_password(PASSWORD)))
        db.commit()
    yield email
    with SessionLocal() as db:
        user = db.scalar(select(User).where(User.email == email))
        if user:
            db.delete(user)
            db.commit()


@pytest.fixture(scope="module")
def auth(client, editor_email):
    res = client.post(
        f"{API}/auth/token", data={"username": editor_email, "password": PASSWORD}
    )
    assert res.status_code == 200, res.text
    return {"Authorization": f"Bearer {res.json()['access_token']}"}


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_reads_are_public(client):
    res = client.get(f"{API}/products")
    assert res.status_code == 200
    assert len(res.json()) > 0


@pytest.mark.parametrize("method,path", [("post", ""), ("patch", "/1"), ("delete", "/1")])
def test_writes_require_a_token(client, method, path):
    # TestClient.delete takes no `json`, so build the request generically.
    res = client.request(method.upper(), f"{API}/domains{path}", json={"name": "nope"})
    assert res.status_code == 401


def test_bad_credentials_are_rejected(client, editor_email):
    res = client.post(
        f"{API}/auth/token", data={"username": editor_email, "password": "wrong"}
    )
    assert res.status_code == 401


def test_garbage_token_is_rejected(client):
    res = client.post(
        f"{API}/domains",
        json={"name": "nope"},
        headers={"Authorization": "Bearer not.a.jwt"},
    )
    assert res.status_code == 401


def test_crud_lifecycle(client, auth):
    name = f"Test Domain {secrets.token_hex(4)}"

    created = client.post(f"{API}/domains", json={"name": name}, headers=auth)
    assert created.status_code == 201
    item = created.json()

    # A duplicate must read as bad input, not a server fault.
    dup = client.post(f"{API}/domains", json={"name": name}, headers=auth)
    assert dup.status_code == 409

    renamed = f"{name} Renamed"
    patched = client.patch(f"{API}/domains/{item['id']}", json={"name": renamed}, headers=auth)
    assert patched.status_code == 200
    assert patched.json()["name"] == renamed
    # PATCH is partial: an omitted field keeps its value.
    assert patched.json()["published"] is True

    assert client.delete(f"{API}/domains/{item['id']}", headers=auth).status_code == 204
    assert client.get(f"{API}/domains/{item['id']}").status_code == 404


def test_unpublished_is_hidden_from_the_public_list(client, auth):
    name = f"Draft {secrets.token_hex(4)}"
    item = client.post(
        f"{API}/domains", json={"name": name, "published": False}, headers=auth
    ).json()
    try:
        public = [d["name"] for d in client.get(f"{API}/domains").json()]
        drafts = [
            d["name"]
            for d in client.get(f"{API}/domains", params={"include_unpublished": True}).json()
        ]
        assert name not in public
        assert name in drafts
    finally:
        client.delete(f"{API}/domains/{item['id']}", headers=auth)


def test_reorder_sets_positions(client, auth):
    before = client.get(f"{API}/stats").json()
    ids = [row["id"] for row in before]

    reordered = client.post(
        f"{API}/stats/reorder", json={"ids": list(reversed(ids))}, headers=auth
    )
    assert reordered.status_code == 200
    assert [r["id"] for r in reordered.json()] == list(reversed(ids))

    restored = client.post(f"{API}/stats/reorder", json={"ids": ids}, headers=auth)
    assert [r["id"] for r in restored.json()] == ids


def test_reorder_rejects_unknown_ids(client, auth):
    res = client.post(f"{API}/stats/reorder", json={"ids": [999_999]}, headers=auth)
    assert res.status_code == 404


def test_jsonb_round_trips(client, auth):
    """Guards the list columns, which are the ones a dialect swap would break."""
    slug = f"test-{secrets.token_hex(4)}"
    payload = {
        "slug": slug,
        "name": "Test Product",
        "category": "AI",
        "status": "Beta",
        "highlights": ["one", "two", "three"],
    }
    item = client.post(f"{API}/products", json=payload, headers=auth).json()
    try:
        assert item["highlights"] == ["one", "two", "three"]
        fetched = client.get(f"{API}/products/{item['id']}").json()
        assert fetched["highlights"] == ["one", "two", "three"]
    finally:
        client.delete(f"{API}/products/{item['id']}", headers=auth)


def test_singletons_read_and_update(client, auth):
    ceo = client.get(f"{API}/ceo")
    assert ceo.status_code == 200
    original_role = ceo.json()["role"]

    patched = client.patch(f"{API}/ceo", json={"role": "Interim CEO"}, headers=auth)
    assert patched.status_code == 200
    assert patched.json()["role"] == "Interim CEO"
    # Untouched fields survive a partial update.
    assert patched.json()["name"] == ceo.json()["name"]

    client.patch(f"{API}/ceo", json={"role": original_role}, headers=auth)


def test_singleton_update_requires_auth(client):
    assert client.patch(f"{API}/ceo", json={"role": "x"}).status_code == 401
