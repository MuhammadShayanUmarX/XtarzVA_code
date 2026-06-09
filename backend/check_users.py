import asyncio
from app.core.database import engine
from sqlalchemy import text

async def main():
    async with engine.connect() as conn:
        res = await conn.execute(text("SELECT id, name, email FROM users"))
        users = res.all()
        print(f"Total users: {len(users)}")
        for u in users:
            print(f"ID: {u[0]}, Name: {u[1]}, Email: {u[2]}")

if __name__ == "__main__":
    asyncio.run(main())
