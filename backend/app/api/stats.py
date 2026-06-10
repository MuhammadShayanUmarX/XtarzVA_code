from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, List
from collections import Counter, defaultdict

from ..core.database import get_db
from ..core.auth import get_current_user
from ..models.models import Run, User
from ..models.schemas import EngineStage
from ..services.activity_summary import build_activity_summary, compute_activity_totals

router = APIRouter()

RANGE_DAYS = {"7d": 7, "30d": 30, "90d": 90, "all": 1825}


def _has_stage(engine_data: Dict[str, Any], stage: str) -> bool:
    return bool(engine_data.get(stage))


def _serialize_run(run: Run) -> dict:
    ed = run.engine_data or {}
    initial = ed.get("initial_input", {})
    return {
        "id": str(run.id),
        "name": run.name,
        "status": run.status,
        "agent": run.agent or run.current_stage,
        "current_stage": run.current_stage,
        "query": initial.get("query", run.name),
        "created_at": run.created_at.isoformat() if run.created_at else None,
    }


async def _get_user_runs(db: AsyncSession, current_user: Optional[User]) -> List[Run]:
    query = select(Run).order_by(Run.created_at.desc())
    if current_user:
        query = query.where(Run.user_id == current_user.id)
    result = await db.execute(query)
    return list(result.scalars().all())


def _in_range(created_at: Optional[datetime], days: int) -> bool:
    if not created_at:
        return False
    if days >= 1825:
        return True
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    ts = created_at if created_at.tzinfo else created_at.replace(tzinfo=timezone.utc)
    return ts >= cutoff


@router.get("/overview")
async def get_overview(
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    runs = await _get_user_runs(db, current_user)
    now = datetime.now(timezone.utc)
    week_ago = now - timedelta(days=7)

    products_found = 0
    suppliers_sourced = 0
    ads_generated = 0
    competitor_scans = 0
    runs_this_week = 0

    for run in runs:
        ed = run.engine_data or {}
        if _has_stage(ed, EngineStage.PRODUCT_INTELLIGENCE.value):
            products_found += 1
        if _has_stage(ed, EngineStage.PRODUCT_SOURCING.value):
            suppliers_sourced += 1
        if _has_stage(ed, EngineStage.META_ADS_SPY.value):
            ads_generated += 1
        if _has_stage(ed, EngineStage.COMPETITOR_INTELLIGENCE.value):
            competitor_scans += 1
        if run.created_at:
            ts = run.created_at if run.created_at.tzinfo else run.created_at.replace(tzinfo=timezone.utc)
            if ts >= week_ago:
                runs_this_week += 1

    return {
        "total_runs": len(runs),
        "products_found": products_found,
        "suppliers_sourced": suppliers_sourced,
        "ads_generated": ads_generated,
        "competitor_scans": competitor_scans,
        "runs_this_week": runs_this_week,
        "completed_runs": sum(1 for r in runs if r.status == "completed"),
        "recent_runs": [_serialize_run(r) for r in runs[:5]],
    }


@router.get("/analytics")
async def get_analytics(
    range: str = Query("7d", alias="range"),
    agent: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    days = RANGE_DAYS.get(range, 7)
    runs = await _get_user_runs(db, current_user)
    filtered = [r for r in runs if _in_range(r.created_at, days)]

    if agent:
        filtered = [r for r in filtered if (r.agent or r.current_stage) == agent]
    if status:
        filtered = [r for r in filtered if r.status == status]

    daily: Dict[str, Dict[str, int]] = defaultdict(lambda: {"runs": 0, "products_found": 0})
    niche_counter: Counter = Counter()
    margins: List[float] = []
    stage_counts: Dict[str, int] = defaultdict(int)

    for run in filtered:
        ed = run.engine_data or {}
        initial = ed.get("initial_input", {})
        niche = initial.get("query") or run.name or "Unknown"
        niche_counter[niche] += 1

        if run.created_at:
            key = run.created_at.strftime("%b %d")
            daily[key]["runs"] += 1
            if _has_stage(ed, EngineStage.PRODUCT_INTELLIGENCE.value):
                daily[key]["products_found"] += 1

        for stage in [
            EngineStage.PRODUCT_INTELLIGENCE.value,
            EngineStage.COMPETITOR_INTELLIGENCE.value,
            EngineStage.PRODUCT_SOURCING.value,
            EngineStage.META_ADS_SPY.value,
            EngineStage.COMMERCE_CREATION.value,
        ]:
            if _has_stage(ed, stage):
                stage_counts[stage] += 1

        pi = ed.get(EngineStage.PRODUCT_INTELLIGENCE.value) or {}
        ps = ed.get(EngineStage.PRODUCT_SOURCING.value) or {}
        margin = ps.get("profit_margin_estimate") or pi.get("estimated_margin")
        if margin is not None:
            try:
                margins.append(float(margin))
            except (TypeError, ValueError):
                pass

    daily_scans = [
        {"date": date, "runs": data["runs"], "products_found": data["products_found"]}
        for date, data in sorted(daily.items(), key=lambda x: x[0])
    ]

    top_niches = []
    if niche_counter:
        max_count = max(niche_counter.values())
        for name, count in niche_counter.most_common(5):
            rate = int((count / max_count) * 100) if max_count else 0
            top_niches.append({"name": name[:40], "run_count": count, "rate": rate})

    margin_buckets = [
        {"val": "0-20", "count": 0},
        {"val": "20-40", "count": 0},
        {"val": "40-60", "count": 0},
        {"val": "60+", "count": 0},
    ]
    for m in margins:
        if m < 20:
            margin_buckets[0]["count"] += 1
        elif m < 40:
            margin_buckets[1]["count"] += 1
        elif m < 60:
            margin_buckets[2]["count"] += 1
        else:
            margin_buckets[3]["count"] += 1

    mean_margin = round(sum(margins) / len(margins), 1) if margins else None

    activity_runs = [build_activity_summary(r) for r in filtered]
    totals = compute_activity_totals(activity_runs)

    return {
        "total_runs": len(filtered),
        "total_products_saved": sum(1 for r in filtered if _has_stage(r.engine_data or {}, EngineStage.PRODUCT_INTELLIGENCE.value)),
        "daily_scans": daily_scans,
        "top_niches": top_niches,
        "margin_spread": margin_buckets,
        "mean_margin": mean_margin,
        "stage_breakdown": dict(stage_counts),
        "completed_runs": sum(1 for r in filtered if r.status == "completed"),
        "activity_runs": activity_runs,
        "totals": totals,
    }
