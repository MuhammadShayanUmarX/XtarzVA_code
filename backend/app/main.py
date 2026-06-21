from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.api.runs import router as runs_router
from app.api.agents import router as agents_router
from app.api.auth import router as auth_router
from app.api.contact import router as contact_router
from app.api.stats import router as stats_router
from app.api.support import router as support_router
from app.api.ad_spy import router as ad_spy_router
from app.core.database import engine
from app.models.models import Base
import logging
import os

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Xtarz Commerce OS",
    description="Agentic commerce research and launch platform.",
    version="3.0.0",
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "detail": str(exc)},
    )

@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    from dotenv import load_dotenv
    load_dotenv()

    if os.getenv("NGROK_AUTHTOKEN"):
        try:
            import ngrok
            listener = await ngrok.forward(8000, authtoken=os.getenv("NGROK_AUTHTOKEN"))
            print(f"\n=======================================================")
            print(f"✅ NGROK TUNNEL ACTIVE: {listener.url()}")
            print(f"=======================================================\n")
            logger.info(f"Ngrok tunnel: {listener.url()}")
        except Exception as e:
            logger.error(f"Ngrok failed: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://xtarzva.site",
        "https://www.xtarzva.site",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v2/auth", tags=["Auth"])
app.include_router(agents_router, prefix="/api/v2/agents", tags=["Agents"])
app.include_router(runs_router, prefix="/api/v2/runs", tags=["Runs"])
app.include_router(contact_router, prefix="/api/v2/contact", tags=["Contact"])
app.include_router(stats_router, prefix="/api/v2/stats", tags=["Stats"])
app.include_router(support_router, prefix="/api/v2/support", tags=["Support"])
app.include_router(ad_spy_router, prefix="/api/v2/ad-spy", tags=["Ad Spy"])

@app.get("/")
async def root():
    return {"status": "online", "version": "3.0.0"}
