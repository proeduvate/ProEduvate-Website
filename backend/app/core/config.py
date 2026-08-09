from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Runtime configuration, read from the environment (and a local .env).

    There are deliberately no defaults for `database_url` or `jwt_secret`.
    A fallback secret is the kind of thing that survives all the way to
    production and signs real tokens, so the app refuses to boot without one
    rather than starting in a quietly insecure state.
    """

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_ttl_minutes: int = 60 * 12

    cors_origins: str = "http://localhost:3000"

    @field_validator("jwt_secret")
    @classmethod
    def _reject_weak_secret(cls, value: str) -> str:
        if len(value) < 32:
            raise ValueError(
                "JWT_SECRET must be at least 32 characters. Generate one with: "
                'python -c "import secrets; print(secrets.token_urlsafe(48))"'
            )
        return value

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]
