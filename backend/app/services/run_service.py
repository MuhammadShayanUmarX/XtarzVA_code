import uuid
from typing import Any, Dict, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.models import Run, User
from ..models.schemas import EngineStage, ProductIntelligenceOutput
from ..core.agent_runner import AgentRunner, IMPORTABLE_AGENTS
from ..core.database import AsyncSessionLocal

VALID_AGENTS = {s.value for s in EngineStage}
active_runners: dict[str, AgentRunner] = {}


async def resolve_user_id(db: AsyncSession, current_user: Optional[User]) -> uuid.UUID:
    if current_user:
        return current_user.id

    query = select(User).order_by(User.created_at.asc())
    result = await db.execute(query)
    default_user = result.scalars().first()
    if not default_user:
        default_user = User(
            id=uuid.uuid4(),
            email="demo@xtarzva.com",
            name="Demo User",
            plan="starter",
            is_onboarded=True,
        )
        db.add(default_user)
        await db.commit()
        await db.refresh(default_user)
    return default_user.id


async def load_source_engine_data(
    db: AsyncSession,
    source_run_id: str,
    product_override: Optional[ProductIntelligenceOutput] = None,
) -> Dict[str, Any]:
    uid = uuid.UUID(source_run_id)
    result = await db.execute(select(Run).where(Run.id == uid))
    source_run = result.scalar_one_or_none()
    if not source_run:
        raise ValueError(f"Source run {source_run_id} not found")

    engine_data = dict(source_run.engine_data or {})

    if product_override:
        product_dict = product_override.model_dump()
        engine_data[EngineStage.PRODUCT_INTELLIGENCE.value] = product_dict
        engine_data["selected_product"] = product_dict
    elif not AgentRunner.get_discovered_product(engine_data):
        raise ValueError(
            "No product found in source run. Complete Product Discovery first or pass a product."
        )

    engine_data["imported_from_run_id"] = str(source_run.id)
    return engine_data


def build_run_name(stage: str, initial_input: Dict[str, Any], run_id: str) -> str:
    label = stage.replace("_", " ").title()
    return (
        initial_input.get("name")
        or initial_input.get("query")
        or f"{label} {run_id[:8]}"
    )


def serialize_run(run: Run) -> dict:
    ed = run.engine_data or {}
    initial = ed.get("initial_input", {})
    product = AgentRunner.get_discovered_product(ed)
    return {
        "id": str(run.id),
        "number": run.number,
        "name": run.name,
        "status": run.status,
        "agent": run.agent or run.current_stage,
        "current_stage": run.current_stage,
        "source_run_id": str(run.source_run_id) if run.source_run_id else None,
        "query": initial.get("query", run.name),
        "product_name": product.get("product_name") if product else None,
        "engine_data": ed,
        "pending_approval": run.pending_approval,
        "created_at": run.created_at.isoformat() if run.created_at else None,
    }


def validate_agent(stage: str) -> str:
    if stage not in VALID_AGENTS:
        raise ValueError(f"Invalid agent: {stage}. Valid agents: {', '.join(sorted(VALID_AGENTS))}")
    return stage


def validate_import_target(target_agent: str) -> str:
    target = validate_agent(target_agent)
    if target not in IMPORTABLE_AGENTS:
        raise ValueError(
            f"Cannot import to {target}. "
            f"Import targets: {', '.join(sorted(IMPORTABLE_AGENTS))}"
        )
    return target


async def create_agent_run(
    db: AsyncSession,
    user_id: uuid.UUID,
    stage: str,
    initial_input: dict,
    source_engine_data: dict | None = None,
    source_run_id: str | None = None,
) -> tuple[str, AgentRunner]:
    run_id = str(uuid.uuid4())
    db_run = Run(
        id=uuid.UUID(run_id),
        user_id=user_id,
        number=1,
        name=build_run_name(stage, initial_input, run_id),
        agent=stage,
        status="running",
        current_stage=stage,
        source_run_id=uuid.UUID(source_run_id) if source_run_id else None,
        engine_data={"initial_input": initial_input},
    )
    db.add(db_run)
    await db.commit()

    runner = AgentRunner(run_id=run_id, db=None)
    active_runners[run_id] = runner
    return run_id, runner


async def execute_agent_background(
    run_id: str,
    stage: str,
    initial_input: dict,
    source_engine_data: dict | None = None,
) -> None:
    """Run an agent with a fresh DB session (request-scoped sessions are closed after the HTTP response)."""
    async with AsyncSessionLocal() as db:
        runner = active_runners.get(run_id)
        if runner:
            runner.db = db
        else:
            runner = await AgentRunner.from_db(run_id, db)
            active_runners[run_id] = runner
        await runner.start_agent(stage, initial_input, source_engine_data)


async def get_or_create_runner(run_id: str, db: AsyncSession) -> AgentRunner:
    if run_id in active_runners:
        active_runners[run_id].db = db
        return active_runners[run_id]

    try:
        runner = await AgentRunner.from_db(run_id, db)
    except ValueError:
        raise ValueError(f"Run {run_id} not found")
    active_runners[run_id] = runner
    return runner
