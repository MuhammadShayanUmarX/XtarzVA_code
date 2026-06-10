from fastapi import APIRouter, BackgroundTasks, HTTPException, Depends, Request, Query
from fastapi.responses import Response
from sse_starlette.sse import EventSourceResponse
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
import asyncio
import json
import logging

from ..core.agent_runner import AgentRunner
from ..models.schemas import (
    EngineStage,
    SelectProductRequest,
    StandaloneRunRequest,
    ImportProductRequest,
)
from ..models.models import Run, User
from ..core.database import get_db
from ..core.auth import get_current_user
from ..services.run_service import (
    resolve_user_id,
    load_source_engine_data,
    serialize_run,
    validate_import_target,
    create_agent_run,
    execute_agent_background,
    get_or_create_runner,
)
from ..services.store_export import build_store_zip

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/")
async def create_run(
    initial_input: dict,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """Start Product Discovery only (no full pipeline)."""
    user_id = await resolve_user_id(db, current_user)
    stage = EngineStage.PRODUCT_INTELLIGENCE.value
    run_id, _runner = await create_agent_run(db, user_id, stage, initial_input)
    background_tasks.add_task(execute_agent_background, run_id, stage, initial_input)
    return {"run_id": run_id, "agent": stage, "status": "started"}


@router.post("/standalone")
async def create_standalone_run(
    payload: StandaloneRunRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """Backward-compatible single-agent run endpoint."""
    user_id = await resolve_user_id(db, current_user)
    stage = payload.stage.value
    source_engine_data = None

    if payload.source_run_id:
        try:
            source_engine_data = await load_source_engine_data(
                db, payload.source_run_id, payload.product
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    run_id, _runner = await create_agent_run(
        db,
        user_id,
        stage,
        payload.initial_input,
        source_engine_data,
        payload.source_run_id,
    )
    background_tasks.add_task(
        execute_agent_background, run_id, stage, payload.initial_input, source_engine_data
    )
    return {"run_id": run_id, "agent": stage, "status": "started"}


@router.post("/import")
async def import_product_run(
    payload: ImportProductRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """
    Import a product from a Product Discovery run into Competitor Intel or Sourcing.
    """
    try:
        target_agent = validate_import_target(payload.target_stage.value)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    user_id = await resolve_user_id(db, current_user)

    try:
        source_engine_data = await load_source_engine_data(
            db, payload.source_run_id, payload.product
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    product = AgentRunner.get_discovered_product(source_engine_data)
    initial_input = {
        **payload.initial_input,
        "query": product.get("product_name", "") if product else payload.initial_input.get("query", ""),
        "imported_from": payload.source_run_id,
    }

    run_id, _runner = await create_agent_run(
        db,
        user_id,
        target_agent,
        initial_input,
        source_engine_data,
        payload.source_run_id,
    )
    background_tasks.add_task(
        execute_agent_background, run_id, target_agent, initial_input, source_engine_data
    )

    return {
        "run_id": run_id,
        "agent": target_agent,
        "source_run_id": payload.source_run_id,
        "product_name": product.get("product_name") if product else None,
        "status": "started",
    }


@router.get("/")
async def list_runs(
    agent: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    query = select(Run).order_by(Run.created_at.desc())
    if current_user:
        query = query.where(Run.user_id == current_user.id)
    if agent:
        query = query.where((Run.agent == agent) | (Run.current_stage == agent))
    if status:
        query = query.where(Run.status == status)

    result = await db.execute(query)
    return [serialize_run(r) for r in result.scalars().all()]


@router.get("/discovered-products")
async def list_discovered_products(
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """Products from completed Product Discovery runs, for import UI."""
    query = (
        select(Run)
        .where(Run.agent == EngineStage.PRODUCT_INTELLIGENCE.value)
        .order_by(Run.created_at.desc())
    )
    if current_user:
        query = query.where(Run.user_id == current_user.id)

    result = await db.execute(query)
    products = []
    for run in result.scalars().all():
        product = AgentRunner.get_discovered_product(run.engine_data or {})
        if not product:
            continue
        products.append({
            "run_id": str(run.id),
            "run_name": run.name,
            "status": run.status,
            "created_at": run.created_at.isoformat() if run.created_at else None,
            "product": product,
        })
    return products


@router.get("/{run_id}/stream")
async def stream_run(run_id: str, request: Request, db: AsyncSession = Depends(get_db)):
    try:
        runner = await get_or_create_runner(run_id, db)
    except ValueError:
        raise HTTPException(status_code=404, detail="Run not found")

    async def event_generator():
        consumer_queue = asyncio.Queue()
        runner.add_consumer(consumer_queue)
        logger.info(f"SSE consumer connected for run {run_id}")

        try:
            yield {
                "event": "state_update",
                "data": json.dumps(runner.state.model_dump(), default=str),
            }

            while True:
                if await request.is_disconnected():
                    break

                try:
                    event = await asyncio.wait_for(consumer_queue.get(), timeout=15.0)
                    yield {
                        "event": event["event"],
                        "data": json.dumps(event["data"], default=str),
                    }
                except asyncio.TimeoutError:
                    yield {"event": "ping", "data": ""}
                except Exception as e:
                    yield {"event": "error", "data": str(e)}
        finally:
            runner.remove_consumer(consumer_queue)

    return EventSourceResponse(event_generator())


async def _export_theme_zip(run_id: str, db: AsyncSession) -> Response:
    uid = uuid.UUID(run_id)
    result = await db.execute(select(Run).where(Run.id == uid))
    db_run = result.scalar_one_or_none()
    if not db_run:
        raise HTTPException(status_code=404, detail="Run not found")
    if db_run.status != "completed":
        raise HTTPException(status_code=400, detail="Run must be completed before exporting")
    engine_data = db_run.engine_data or {}
    if EngineStage.COMMERCE_CREATION.value not in engine_data:
        raise HTTPException(status_code=400, detail="No store builder output found for this run")

    try:
        zip_bytes, filename = await build_store_zip(engine_data, run_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return Response(
        content=zip_bytes,
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/{run_id}/theme-export")
async def export_theme_zip(run_id: str, db: AsyncSession = Depends(get_db)):
    """Download uploadable Shopify theme ZIP."""
    return await _export_theme_zip(run_id, db)


@router.get("/{run_id}/store-export")
async def export_store_zip(run_id: str, db: AsyncSession = Depends(get_db)):
    """Download Shopify theme ZIP (legacy alias)."""
    return await _export_theme_zip(run_id, db)


@router.get("/{run_id}")
async def get_run(run_id: str, db: AsyncSession = Depends(get_db)):
    uid = uuid.UUID(run_id)
    result = await db.execute(select(Run).where(Run.id == uid))
    db_run = result.scalar_one_or_none()
    if not db_run:
        raise HTTPException(status_code=404, detail="Run not found")
    return serialize_run(db_run)


@router.get("/{run_id}/product")
async def get_run_product(run_id: str, db: AsyncSession = Depends(get_db)):
    uid = uuid.UUID(run_id)
    result = await db.execute(select(Run).where(Run.id == uid))
    db_run = result.scalar_one_or_none()
    if not db_run:
        raise HTTPException(status_code=404, detail="Run not found")

    product = AgentRunner.get_discovered_product(db_run.engine_data or {})
    if not product:
        raise HTTPException(status_code=404, detail="No product found in this run")

    return {
        "run_id": str(db_run.id),
        "product": product,
        "status": db_run.status,
    }


@router.post("/{run_id}/select-product")
async def select_run_product(
    run_id: str,
    payload: SelectProductRequest,
    db: AsyncSession = Depends(get_db),
):
    try:
        runner = await get_or_create_runner(run_id, db)
    except ValueError:
        raise HTTPException(status_code=404, detail="Run not found")
    return await runner.select_product(payload.product)


@router.post("/{run_id}/approve")
async def approve_run(run_id: str, db: AsyncSession = Depends(get_db)):
    """Legacy endpoint — single-agent runs complete automatically."""
    try:
        runner = await get_or_create_runner(run_id, db)
    except ValueError:
        raise HTTPException(status_code=404, detail="Run not found")
    return {"status": "completed", "message": "Single-agent run — no further stages to approve"}


@router.post("/{run_id}/pause")
async def pause_run(run_id: str, db: AsyncSession = Depends(get_db)):
    try:
        runner = await get_or_create_runner(run_id, db)
    except ValueError:
        raise HTTPException(status_code=404, detail="Run not found")
    return await runner.pause_workflow()


@router.post("/{run_id}/resume")
async def resume_run(run_id: str, db: AsyncSession = Depends(get_db)):
    try:
        runner = await get_or_create_runner(run_id, db)
    except ValueError:
        raise HTTPException(status_code=404, detail="Run not found")
    return {"status": runner.state.status, "message": "Single-agent run — resume not applicable"}


@router.post("/{run_id}/cancel")
async def cancel_run(run_id: str, db: AsyncSession = Depends(get_db)):
    try:
        runner = await get_or_create_runner(run_id, db)
    except ValueError:
        raise HTTPException(status_code=404, detail="Run not found")
    return await runner.stop_workflow()
