import asyncio
import sqlite3
from app.core.database import engine
from app.models.models import Base

def migrate_sqlite():
    conn = sqlite3.connect("xtarzva.db")
    cursor = conn.cursor()
    
    # Check if hashed_password already exists
    cursor.execute("PRAGMA table_info(users)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if "hashed_password" not in columns:
        print("Adding hashed_password column to users table...")
        cursor.execute("ALTER TABLE users ADD COLUMN hashed_password VARCHAR;")
        conn.commit()
        print("Column added successfully!")
    else:
        print("hashed_password column already exists in users table.")
        
    conn.close()

async def create_tables():
    async with engine.begin() as conn:
        print("Creating any missing tables defined in SQLAlchemy models...")
        await conn.run_sync(Base.metadata.create_all)
        print("All missing tables verified/created!")

if __name__ == "__main__":
    migrate_sqlite()
    asyncio.run(create_tables())
