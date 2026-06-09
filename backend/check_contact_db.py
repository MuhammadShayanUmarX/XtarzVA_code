import asyncio
import sys
from app.core.database import engine
from app.models.models import Base, ContactSubmission
from sqlalchemy import text

async def check_db_schema():
    print("Initiating database schema verification for contact submissions...")
    try:
        # Create all tables including our new contact_submissions table
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("Schema compiled and contact_submissions table verified successfully!")

        async with engine.connect() as conn:
            # Query the table structure
            print("\nVerifying 'contact_submissions' schema:")
            res = await conn.execute(text("PRAGMA table_info(contact_submissions);"))
            columns = res.all()
            for col in columns:
                print(f" - Column: {col[1]} ({col[2]}) | Nullable: {not col[3]} | Default: {col[4]}")
            
            # Query current contact submissions count and entries
            count_res = await conn.execute(text("SELECT COUNT(*) FROM contact_submissions;"))
            count = count_res.scalar()
            print(f"\nTotal contact submissions in database: {count}")
            
            if count > 0:
                print("\nLast 5 Contact Submissions:")
                entries_res = await conn.execute(
                    text("SELECT name, email, topic, message, created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 5;")
                )
                entries = entries_res.all()
                for idx, entry in enumerate(entries, 1):
                    print(f"\n[{idx}] Date: {entry[4]}")
                    print(f"    From: {entry[0]} ({entry[1]})")
                    print(f"    Topic: {entry[2]}")
                    print(f"    Message: {entry[3]}")
            
    except Exception as e:
        print(f"Error during schema verification: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(check_db_schema())
