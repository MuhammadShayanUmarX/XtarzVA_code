from typing import Any, Dict

from ..core.prompt_loader import load_agent_definitions

AGENT_DEFINITIONS: Dict[str, Dict[str, Any]] = load_agent_definitions()

_DEFAULT_DEFINITION = {
    "name": "Commerce Agent",
    "role": "Commerce Agent",
    "goal": "Complete the assigned research task.",
    "framework": "langchain",
}


def get_agent_definition(agent_id: str) -> Dict[str, Any]:
    agents = load_agent_definitions()
    definition = agents.get(agent_id)
    if definition:
        return definition
    return {
        **_DEFAULT_DEFINITION,
        "name": agent_id.replace("_", " ").title(),
    }
