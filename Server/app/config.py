from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    API_KEY: str
    REDIS_URL: str
    REDIS_URL_local: str
    testing: bool = True

    class Config:
        env_file = Path(__file__).parent / ".env"

settings = Settings()