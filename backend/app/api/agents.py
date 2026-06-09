from fastapi import APIRouter, BackgroundTasks, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from ..models.schemas import EngineStage, AgentRunRequest
from ..models.models import User
from ..core.database import get_db
from ..core.auth import get_current_user
from ..services.run_service import (
    resolve_user_id,
    load_source_engine_data,
    validate_agent,
    create_agent_run,
    execute_agent_background,
)
from ..core.integrations import get_integration_status
from ..agents.definitions import get_agent_definition

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/{agent_id}/runs")
async def start_agent_run(
    agent_id: str,
    payload: AgentRunRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    try:
        stage = validate_agent(agent_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    user_id = await resolve_user_id(db, current_user)
    source_engine_data = None
    source_run_id = payload.source_run_id

    if source_run_id:
        try:
            source_engine_data = await load_source_engine_data(
                db, source_run_id, payload.product
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    run_id, _runner = await create_agent_run(
        db, user_id, stage, payload.initial_input, source_engine_data, source_run_id
    )
    background_tasks.add_task(
        execute_agent_background, run_id, stage, payload.initial_input, source_engine_data
    )

    return {"run_id": run_id, "agent": stage, "status": "started"}


@router.get("/integrations")
async def list_integrations():
    """Which third-party APIs are configured and which agents use them."""
    return get_integration_status()


@router.get("/")
async def list_agents():
    status = get_integration_status()
    stages = [
        EngineStage.PRODUCT_INTELLIGENCE,
        EngineStage.COMPETITOR_INTELLIGENCE,
        EngineStage.META_ADS_SPY,
        EngineStage.PRODUCT_SOURCING,
        EngineStage.COMMERCE_CREATION,
    ]
    import_map = {
        EngineStage.COMPETITOR_INTELLIGENCE.value: EngineStage.PRODUCT_INTELLIGENCE.value,
        EngineStage.PRODUCT_SOURCING.value: EngineStage.PRODUCT_INTELLIGENCE.value,
    }
    agents_meta = []
    for stage in stages:
        definition = get_agent_definition(stage.value)
        item = {
            "id": stage.value,
            "name": definition["name"],
            "role": definition["role"],
            "goal": definition["goal"],
            "framework": definition["framework"],
            "requires_import": stage.value in import_map,
            "import_from": import_map.get(stage.value),
        }
        agent_status = status["agents"].get(stage.value, {})
        item["integrations_ready"] = agent_status.get("ready", False)
        item["integrations"] = agent_status.get("integrations", {})
        agents_meta.append(item)
    return agents_meta
