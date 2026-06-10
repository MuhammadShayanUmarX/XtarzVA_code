from typing import Any, Dict, List, Optional

from ..models.models import Run
from ..models.schemas import EngineStage


def _safe_float(val: Any) -> Optional[float]:
    if val is None:
        return None
    try:
        return float(val)
    except (TypeError, ValueError):
        return None


def _top_items(items: List[Dict[str, Any]], limit: int = 3) -> List[Dict[str, Any]]:
    return items[:limit] if items else []


def _map_products(candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [
        {
            "name": c.get("product_name", ""),
            "platform": c.get("platform", ""),
            "price": c.get("price"),
            "url": c.get("source_url", ""),
            "demand": c.get("demand_signal"),
        }
        for c in candidates
        if c.get("product_name")
    ]


def _map_competitors(profiles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [
        {
            "store_name": c.get("store_name", ""),
            "platform": c.get("platform", ""),
            "price": c.get("price") or c.get("price_range"),
            "url": c.get("store_url", ""),
            "threat_level": c.get("threat_level"),
        }
        for c in profiles
        if c.get("store_name")
    ]


def _map_suppliers(options: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [
        {
            "supplier_name": s.get("supplier_name", ""),
            "platform": s.get("platform", ""),
            "price_per_unit": s.get("price_per_unit"),
            "moq": s.get("moq"),
            "country": s.get("country"),
            "url": s.get("product_url", ""),
        }
        for s in options
        if s.get("supplier_name")
    ]


def _key_result(agent: str, ed: Dict[str, Any], summary: Dict[str, Any]) -> str:
    if agent == EngineStage.PRODUCT_INTELLIGENCE.value:
        name = summary.get("product_name") or "—"
        count = summary.get("product_candidates_count", 0)
        return f"{name}" + (f" (+{count} found)" if count > 1 else "")
    if agent == EngineStage.COMPETITOR_INTELLIGENCE.value:
        top = summary.get("top_competitors") or []
        count = summary.get("competitors_count", 0)
        if top:
            return f"{top[0].get('store_name', '—')} (+{max(count - 1, 0)} more)" if count > 1 else top[0].get("store_name", "—")
        return f"{count} competitors" if count else "—"
    if agent == EngineStage.PRODUCT_SOURCING.value:
        best = summary.get("best_supplier") or {}
        if best.get("supplier_name"):
            price = best.get("price_per_unit")
            price_str = f" @ ${price}" if price is not None else ""
            return f"{best['supplier_name']}{price_str}"
        return f"{summary.get('sourcing_count', 0)} suppliers"
    if agent == EngineStage.META_ADS_SPY.value:
        ma = ed.get(EngineStage.META_ADS_SPY.value) or {}
        title = ma.get("product_title") or ma.get("seo_meta_title")
        if title:
            return title
        count = summary.get("ads_count", 0)
        return f"{count} ad{'s' if count != 1 else ''} generated"
    if agent == EngineStage.COMMERCE_CREATION.value:
        cc = ed.get(EngineStage.COMMERCE_CREATION.value) or {}
        return cc.get("theme_name") or cc.get("hero_headline") or "Theme ready"
    return summary.get("product_name") or "—"


def build_activity_summary(run: Run) -> Dict[str, Any]:
    ed = run.engine_data or {}
    initial = ed.get("initial_input") or {}
    agent = run.agent or run.current_stage or ""

    pi = ed.get(EngineStage.PRODUCT_INTELLIGENCE.value) or ed.get("selected_product") or {}
    ci = ed.get(EngineStage.COMPETITOR_INTELLIGENCE.value) or {}
    ps = ed.get(EngineStage.PRODUCT_SOURCING.value) or {}
    ma = ed.get(EngineStage.META_ADS_SPY.value) or {}
    cc = ed.get(EngineStage.COMMERCE_CREATION.value) or {}

    product_candidates = ed.get("product_candidates") or []
    competitor_profiles = ed.get("competitor_profiles") or []
    sourcing_options = ed.get("sourcing_options") or []

    if not sourcing_options and ps.get("suppliers"):
        sourcing_options = ps["suppliers"]

    top_products = _top_items(_map_products(product_candidates))
    top_competitors = _top_items(_map_competitors(competitor_profiles))
    top_suppliers = _top_items(_map_suppliers(sourcing_options))

    best_option = ps.get("best_option") or {}
    best_supplier = None
    if best_option.get("supplier_name"):
        best_supplier = {
            "supplier_name": best_option.get("supplier_name", ""),
            "platform": best_option.get("platform", ""),
            "price_per_unit": best_option.get("price_per_unit"),
            "moq": best_option.get("moq"),
            "country": best_option.get("country"),
            "url": best_option.get("product_url", ""),
        }

    profit_margin = _safe_float(ps.get("profit_margin_estimate")) or _safe_float(pi.get("estimated_margin"))

    summary = {
        "run_id": str(run.id),
        "name": run.name,
        "status": run.status,
        "agent": agent,
        "created_at": run.created_at.isoformat() if run.created_at else None,
        "source_run_id": str(run.source_run_id) if run.source_run_id else None,
        "search_query": initial.get("query") or run.name or "",
        "product_name": pi.get("product_name"),
        "trend_score": pi.get("trend_score"),
        "demand_score": pi.get("demand_score"),
        "estimated_margin": _safe_float(pi.get("estimated_margin")),
        "product_candidates_count": len(product_candidates),
        "top_products": top_products,
        "competitors_count": len(competitor_profiles),
        "top_competitors": top_competitors,
        "saturation_score": ci.get("market_saturation_score"),
        "sourcing_count": len(sourcing_options),
        "best_supplier": best_supplier,
        "top_suppliers": top_suppliers,
        "profit_margin": profit_margin,
        "ads_count": len(ma.get("active_ads") or []),
        "store_title": cc.get("theme_name") or ma.get("product_title"),
        "seo_title": ma.get("seo_meta_title"),
    }
    summary["key_result"] = _key_result(agent, ed, summary)
    summary["margin_or_price"] = (
        f"{profit_margin}%" if profit_margin is not None
        else (f"${best_supplier['price_per_unit']}" if best_supplier and best_supplier.get("price_per_unit") is not None else "—")
    )
    return summary


def compute_activity_totals(summaries: List[Dict[str, Any]]) -> Dict[str, Any]:
    total_competitors = sum(s.get("competitors_count", 0) for s in summaries)
    total_products = sum(s.get("product_candidates_count", 0) for s in summaries)
    total_suppliers = sum(s.get("sourcing_count", 0) for s in summaries)

    margins = [s["profit_margin"] for s in summaries if s.get("profit_margin") is not None]
    unit_prices = []
    for s in summaries:
        for sup in s.get("top_suppliers") or []:
            p = sup.get("price_per_unit")
            if p is not None:
                unit_prices.append(float(p))
        best = s.get("best_supplier") or {}
        if best.get("price_per_unit") is not None:
            unit_prices.append(float(best["price_per_unit"]))

    return {
        "competitors_found": total_competitors,
        "products_researched": total_products,
        "suppliers_found": total_suppliers,
        "avg_margin": round(sum(margins) / len(margins), 1) if margins else None,
        "avg_unit_price": round(sum(unit_prices) / len(unit_prices), 2) if unit_prices else None,
    }
