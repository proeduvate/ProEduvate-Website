from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.config import get_settings

_settings = get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

# bcrypt hashes at most 72 bytes and ignores the rest. passlib used to paper
# over this; using bcrypt directly means handling it here, and rejecting is
# the only safe option -- silently truncating would let two different long
# passwords that share a 72-byte prefix authenticate each other.
BCRYPT_MAX_BYTES = 72


class PasswordTooLongError(ValueError):
    def __init__(self) -> None:
        super().__init__(f"Password must be at most {BCRYPT_MAX_BYTES} bytes")


def _encode(raw: str) -> bytes:
    encoded = raw.encode("utf-8")
    if len(encoded) > BCRYPT_MAX_BYTES:
        raise PasswordTooLongError
    return encoded


def hash_password(raw: str) -> str:
    return bcrypt.hashpw(_encode(raw), bcrypt.gensalt()).decode("utf-8")


def verify_password(raw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(_encode(raw), hashed.encode("utf-8"))
    except (PasswordTooLongError, ValueError):
        # A malformed stored hash must fail closed, not raise a 500 that
        # tells the caller their input reached the comparison.
        return False


def create_access_token(subject: str) -> str:
    expires = datetime.now(timezone.utc) + timedelta(minutes=_settings.access_token_ttl_minutes)
    payload = {"sub": subject, "exp": expires}
    return jwt.encode(payload, _settings.jwt_secret, algorithm=_settings.jwt_algorithm)


def require_editor(token: str = Depends(oauth2_scheme)) -> str:
    """
    Gate for every write endpoint.

    Reads are public because the site itself is public; writes are not. The
    generic failure message is deliberate -- distinguishing "expired" from
    "malformed" tells an attacker which half of the problem to work on.
    """
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, _settings.jwt_secret, algorithms=[_settings.jwt_algorithm])
    except jwt.PyJWTError:
        raise credentials_error from None

    subject = payload.get("sub")
    if not subject:
        raise credentials_error
    return subject
