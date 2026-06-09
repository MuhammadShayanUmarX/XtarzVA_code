import logging
from typing import Type, Tuple

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq
from pydantic import BaseModel

from ..config import settings
from .definitions import get_agent_definition

logger = logging.getLogger(__name__)

MODEL_NAME = "llama-3.1-8b-instant"


def _build_system_prompt(agent_id: str, task_prompt: str) -> str:
    agent = get_agent_definition(agent_id)
    return (
        f"You are the {agent['name']}.\n"
        f"Role: {agent['role']}\n"
        f"Goal: {agent['goal']}\n"
        f"Framework: LangChain structured agent\n\n"
        f"{task_prompt}"
    )


def _get_chat_model(temperature: float = 0.3) -> ChatGroq:
    if not settings.GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not configured.")
    return ChatGroq(
        groq_api_key=settings.GROQ_API_KEY,
        model_name=MODEL_NAME,
        temperature=temperature,
    )


async def invoke_structured_agent(
    agent_id: str,
    task_prompt: str,
    user_message: str,
    output_model: Type[BaseModel],
    run_id: str,
    temperature: float = 0.3,
) -> Tuple[BaseModel, str]:
    """Run a LangChain agent with structured JSON output (Pydantic schema)."""
    llm = _get_chat_model(temperature)
    structured_llm = llm.with_structured_output(output_model, method="json_mode")
    system_content = _build_system_prompt(agent_id, task_prompt)

    logger.info(
        f"[{run_id}] LangChain agent invoke | agent={agent_id} | model={MODEL_NAME}"
    )

    result = await structured_llm.ainvoke(
        [
            SystemMessage(content=system_content),
            HumanMessage(content=user_message),
        ]
    )
    return result, "langchain-groq"
