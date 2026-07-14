import os
import logging
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

logger = logging.getLogger("manager_db")

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
# Use hr_recruitment to match the HR backend's database
DB_NAME   = os.getenv("MANAGER_DB_NAME", "hr_recruitment")

client = AsyncIOMotorClient(MONGO_URI)
db     = client[DB_NAME]


async def ping_db() -> bool:
    """Verify MongoDB connection on startup. Returns True if connected."""
    try:
        await client.admin.command("ping")
        logger.info("✅ MongoDB connected → %s / %s", MONGO_URI, DB_NAME)
        return True
    except Exception as e:
        logger.error("❌ MongoDB connection failed: %s", e)
        return False
