from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Escape Tutorial Hell"
    DATABASE_URL: str = "sqlite:///../db.sqlite3"
    SECRET_KEY: str = "change-later"  # We'll use this later for auth
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
