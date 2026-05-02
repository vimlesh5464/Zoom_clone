from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str   # ✅ use THIS only
    JWT_SECRET: str = "secret"
    PORT: int = 8000

settings = Settings()