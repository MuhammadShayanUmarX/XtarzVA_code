from fastapi import APIRouter, BackgroundTasks, HTTPException, Depends, Request
from sse_starlette.sse import EventSourceResponse
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
import asyncio
import json
import logging

from ..core.orchestrator import Orchestrator
from ..models.schemas import EngineStage
from ..models.models import Run, User
from ..core.database import get_db
from ..core.auth import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

# In-memory storage for active orchestrators
active_orchestrators: Dict[str, Orchestrator] = {}

@router.post("/")
async def create_run(
    initial_input: Dict[str, Any], 
    background_tasks: BackgroundTasks, 
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):


    # 1. Get user id from authenticated session or default developer user in DB
    user_id = None
    if current_user:
        user_id = current_user.id
    else:
        # Fallback to the first user or create a default developer user in SQLite
        query = select(User).order_by(User.created_at.asc())
        result = await db.execute(query)
        default_user = result.scalars().first()
        if not default_user:
            default_user = User(
                id=uuid.uuid4(),
                email="demo@xtarzva.com",
                name="Demo User",
                plan="starter",
                is_onboarded=True
            )
            db.add(default_user)
            await db.commit()
            await db.refresh(default_user)
        user_id = default_user.id
    
    # 2. Create the Run in database
    run_id = str(uuid.uuid4())
    db_run = Run(
        id=uuid.UUID(run_id),
        user_id=user_id,
        number=1, 
        name=initial_input.get("name") or initial_input.get("query") or f"Scan {run_id[:8]}",
        status="running",
        current_stage=EngineStage.PRODUCT_INTELLIGENCE.value,
        engine_data={"initial_input": initial_input}
    )
    db.add(db_run)
    await db.commit()

    # 3. Initialize Orchestrator and start in background
    orchestrator = Orchestrator(run_id=run_id, db=db)
    active_orchestrators[run_id] = orchestrator
    
    background_tasks.add_task(orchestrator.start_workflow, initial_input)
    
    return {"run_id": run_id, "status": "started"}

@router.post("/standalone")
async def create_standalone_run(
    payload: Dict[str, Any], 
    background_tasks: BackgroundTasks, 
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):


    user_id = None
    if current_user:
        user_id = current_user.id
    else:
        query = select(User).order_by(User.created_at.asc())
        result = await db.execute(query)
        default_user = result.scalars().first()
        if not default_user:
            default_user = User(
                id=uuid.uuid4(),
                email="demo@xtarzva.com",
                name="Demo User",
                plan="starter",
                is_onboarded=True
            )
            db.add(default_user)
            await db.commit()
            await db.refresh(default_user)
        user_id = default_user.id
    
    stage = payload.get("stage", EngineStage.PRODUCT_INTELLIGENCE.value)
    initial_input = payload.get("initial_input", {})
    
    run_id = str(uuid.uuid4())
    db_run = Run(
        id=uuid.UUID(run_id),
        user_id=user_id,
        number=1, 
        name=initial_input.get("name") or initial_input.get("query") or f"{stage.replace('_', ' ').title()} {run_id[:8]}",
        status="running",
        current_stage=stage,
        engine_data={"initial_input": initial_input}
    )
    db.add(db_run)
    await db.commit()

    orchestrator = Orchestrator(run_id=run_id, db=db)
    active_orchestrators[run_id] = orchestrator
    
    background_tasks.add_task(orchestrator.start_standalone_stage, stage, initial_input)
    
    return {"run_id": run_id, "status": "started"}

@router.get("/{run_id}/stream")
async def stream_run(run_id: str, request: Request, db: AsyncSession = Depends(get_db)):
    orchestrator = await get_or_create_orchestrator(run_id, db)

    async def event_generator():
        """
        SSE event generator using a BROADCAST pattern.
        Each SSE consumer gets its OWN asyncio.Queue that receives copies of all events.
        This prevents multiple browser tabs / SSE reconnections from "stealing" events.
        """
        # Create a per-consumer queue
        consumer_queue = asyncio.Queue()
        
        # Register this consumer
        orchestrator.add_consumer(consumer_queue)
        logger.info(f"SSE consumer connected for run {run_id} (total: {len(orchestrator._consumers)})")
        
        try:
            # 1. Send initial state immediately
            yield {
                "event": "state_update",
                "data": json.dumps(orchestrator.state.model_dump(), default=str)
            }
            
            while True:
                # Check if client disconnected
                if await request.is_disconnected():
                    break

                try:
                    # Wait for next event from our own consumer queue
                    event = await asyncio.wait_for(consumer_queue.get(), timeout=15.0)
                    yield {
                        "event": event["event"],
                        "data": json.dumps(event["data"], default=str)
                    }
                except asyncio.TimeoutError:
                    # Send keep-alive ping
                    yield {"event": "ping", "data": ""}
                except Exception as e:
                    yield {"event": "error", "data": str(e)}
        finally:
            # Cleanup: remove this consumer when SSE disconnects
            orchestrator.remove_consumer(consumer_queue)
            logger.info(f"SSE consumer disconnected for run {run_id} (remaining: {len(orchestrator._consumers)})")

    return EventSourceResponse(event_generator())

@router.get("/")
async def list_runs(db: AsyncSession = Depends(get_db)):
    query = select(Run).order_by(Run.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{run_id}")
async def get_run(run_id: str, db: AsyncSession = Depends(get_db)):
    orchestrator = await get_or_create_orchestrator(run_id, db)
    return orchestrator.state

async def get_or_create_orchestrator(run_id: str, db: AsyncSession) -> Orchestrator:
    if run_id in active_orchestrators:
        return active_orchestrators[run_id]
    
    # Re-hydrate from DB
    try:
        orchestrator = await Orchestrator.from_db(run_id, db)
        active_orchestrators[run_id] = orchestrator
        return orchestrator
    except ValueError:
        raise HTTPException(status_code=404, detail="Run not found")

@router.post("/{run_id}/approve")
async def approve_run(run_id: str, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    orchestrator = await get_or_create_orchestrator(run_id, db)
    
    # We clear the flag synchronously to avoid double-clicks
    orchestrator.state.pending_approval = False
    orchestrator.state.status = "running"
    
    # Push an IMMEDIATE state update to the frontend so the UI transitions
    await orchestrator.broadcast_state_update()
    
    # Resume the workflow in the background
    background_tasks.add_task(orchestrator.run_next_stage)
    
    return {"status": "Approved, proceeding in background"}

@router.post("/{run_id}/pause")
async def pause_run(run_id: str, db: AsyncSession = Depends(get_db)):
    orchestrator = await get_or_create_orchestrator(run_id, db)
    return await orchestrator.pause_workflow()

@router.post("/{run_id}/resume")
async def resume_run(run_id: str, db: AsyncSession = Depends(get_db)):
    orchestrator = await get_or_create_orchestrator(run_id, db)
    return await orchestrator.resume_workflow()

@router.post("/{run_id}/cancel")
async def cancel_run(run_id: str, db: AsyncSession = Depends(get_db)):
    orchestrator = await get_or_create_orchestrator(run_id, db)
    return await orchestrator.stop_workflow()
