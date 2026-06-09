import asyncio
from app.core.database import engine
from sqlalchemy import text

async def check_db():
    async with engine.connect() as conn:
        print("Checking tables in database:")
        # List tables
        res = await conn.execute(text("SELECT name FROM sqlite_master WHERE type='table';"))
        tables = res.scalars().all()
        print("Tables:", tables)
        
        for table in tables:
            res_count = await conn.execute(text(f"SELECT COUNT(*) FROM {table};"))
            count = res_count.scalar()
            print(f"Table '{table}': {count} rows")
            
            if count > 0:
                res_rows = await conn.execute(text(f"SELECT * FROM {table} LIMIT 2;"))
                print(f"Sample rows from '{table}':")
                for row in res_rows.mappings():
                    print(dict(row))

if __name__ == "__main__":
    asyncio.run(check_db())
