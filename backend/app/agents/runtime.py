import logging
from typing import Optional, Type, Tuple

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq
from pydantic import BaseModel

from ..config import settings
from ..core.prompt_loader import load_runtime_wrapper, render
from .definitions import get_agent_definition

logger = logging.getLogger(__name__)


def _build_system_prompt(agent_id: str, task_prompt: str) -> str:
    agent = get_agent_definition(agent_id)
    return render(
        load_runtime_wrapper(),
        name=agent["name"],
        role=agent["role"],
        goal=agent["goal"],
        task_prompt=task_prompt,
    )


def _get_chat_model(temperature: float = 0.3, model_name: Optional[str] = None) -> ChatGroq:
    if not settings.GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not configured.")
    return ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model=model_name or settings.GROQ_MODEL,
        temperature=temperature,
    )



async def invoke_structured_agent(
    agent_id: str,
    task_prompt: str,
    user_message: str,
    output_model: Type[BaseModel],
    run_id: str,
    temperature: float = 0.3,
    model_name: Optional[str] = None,
) -> Tuple[BaseModel, str]:
    """Run a LangChain agent with structured JSON output (Pydantic schema)."""
    resolved_model = model_name or settings.GROQ_MODEL
    llm = _get_chat_model(temperature, model_name=resolved_model)
    structured_llm = llm.with_structured_output(output_model, method="json_mode")
    system_content = _build_system_prompt(agent_id, task_prompt)

    logger.info(
        f"[{run_id}] LangChain agent invoke | agent={agent_id} | "
        f"model={resolved_model}"
    )

    result = await structured_llm.ainvoke(
        [
            SystemMessage(content=system_content),
            HumanMessage(content=user_message),
        ]
    )
    return result, "langchain-groq"
