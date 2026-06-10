"""Backward-compatible export module — delegates to theme_builder."""

from typing import Any, Dict, Tuple

from .theme_builder import build_theme_zip

__all__ = ["build_store_zip", "build_theme_zip"]


async def build_store_zip(
    engine_data: Dict[str, Any],
    run_id: str,
) -> Tuple[bytes, str]:
    """Build theme ZIP (legacy name kept for compatibility)."""
    return await build_theme_zip(engine_data, run_id)
