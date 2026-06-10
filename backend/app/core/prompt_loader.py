"""Load and render agent prompts from JSON files in app/prompts/."""

from __future__ import annotations

import json
import logging
import re
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, Optional

_PLACEHOLDER_RE = re.compile(r"\{(\w+)\}")

logger = logging.getLogger(__name__)

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


class PromptNotFoundError(FileNotFoundError):
    pass


@lru_cache(maxsize=32)
def load_agent_prompts(agent_id: str) -> Dict[str, Any]:
    path = PROMPTS_DIR / f"{agent_id}.json"
    if not path.exists():
        raise PromptNotFoundError(f"No prompts file for agent: {agent_id} ({path})")
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    logger.debug("Loaded prompts for agent=%s version=%s", agent_id, data.get("version"))
    return data


def clear_prompt_cache() -> None:
    load_agent_prompts.cache_clear()


def render(template: str, **kwargs: Any) -> str:
    """Replace `{name}` placeholders only; leave other braces (JSON, Liquid) untouched."""

    def _replace(match: re.Match[str]) -> str:
        key = match.group(1)
        if key in kwargs:
            return str(kwargs[key])
        return match.group(0)

    return _PLACEHOLDER_RE.sub(_replace, template)


def get_fragments(agent_id: str) -> Dict[str, str]:
    cfg = load_agent_prompts(agent_id)
    fragments = cfg.get("fragments", {})
    return {k: str(v) for k, v in fragments.items()}


def build_system_prompt(agent_id: str, **variables: Any) -> str:
    cfg = load_agent_prompts(agent_id)
    template = cfg.get("system_template") or cfg.get("system", "")
    if not template:
        raise ValueError(f"Agent {agent_id} has no system_template in prompts JSON")
    merged = {**get_fragments(agent_id), **variables}
    return render(template, **merged)


def build_user_prompt(agent_id: str, **variables: Any) -> str:
    cfg = load_agent_prompts(agent_id)
    user_cfg = cfg.get("user", {})
    if isinstance(user_cfg, str):
        template = user_cfg
    else:
        template = user_cfg.get("template", "")
    if not template:
        raise ValueError(f"Agent {agent_id} has no user template in prompts JSON")
    merged = {**get_fragments(agent_id), **variables}
    return render(template, **merged)


def get_user_task(agent_id: str) -> str:
    cfg = load_agent_prompts(agent_id)
    user_cfg = cfg.get("user", {})
    if isinstance(user_cfg, dict):
        return user_cfg.get("task", "")
    return ""


def get_max_prompt_chars(agent_id: str, default: int = 3500) -> int:
    return int(load_agent_prompts(agent_id).get("max_prompt_chars", default))


def get_llm_config(agent_id: str) -> Dict[str, Any]:
    return load_agent_prompts(agent_id).get("llm", {})


def get_tone_aesthetics(agent_id: str) -> Dict[str, str]:
    return load_agent_prompts(agent_id).get("tone_aesthetics", {})


def get_image_prompt_templates(agent_id: str) -> Dict[str, str]:
    return load_agent_prompts(agent_id).get("image_prompts", {})


def get_field_labels(agent_id: str) -> Dict[str, str]:
    return load_agent_prompts(agent_id).get("field_labels", {})


def render_user_block(agent_id: str, block_name: str, **kwargs: Any) -> str:
    cfg = load_agent_prompts(agent_id)
    blocks = cfg.get("user_blocks", {})
    template = blocks.get(block_name, "")
    if not template:
        return ""
    return render(template, **kwargs)


@lru_cache(maxsize=1)
def load_runtime_wrapper() -> str:
    path = PROMPTS_DIR / "runtime.json"
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    return data["wrapper_template"]


@lru_cache(maxsize=1)
def load_agent_definitions() -> Dict[str, Dict[str, Any]]:
    path = PROMPTS_DIR / "agent_definitions.json"
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    return data.get("agents", {})
