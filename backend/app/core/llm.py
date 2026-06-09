import time
import logging
import asyncio
from typing import Type, Tuple
from pydantic import BaseModel

from ..agents.runtime import invoke_structured_agent

logger = logging.getLogger(__name__)

MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 12


class LLMRouter:
    """LangChain-backed LLM router with retries and circuit breaker."""

    def __init__(self):
        self.circuit_breaker = {"failures": 0, "last_failure": 0, "open_until": 0}
        logger.info("LangChain agent runtime initialized (ChatGroq / llama-3.1-8b-instant)")

    def _is_available(self) -> bool:
        return time.time() >= self.circuit_breaker["open_until"]

    async def complete(
        self,
        agent_id: str,
        system_prompt: str,
        user_message: str,
        output_model: Type[BaseModel],
        run_id: str,
        temperature: float = 0.3,
    ) -> Tuple[BaseModel, str]:
        if not self._is_available():
            wait_time = self.circuit_breaker["open_until"] - time.time()
            if 0 < wait_time <= 60:
                logger.warning(f"[{run_id}] Circuit breaker active. Waiting {wait_time:.0f}s...")
                await asyncio.sleep(wait_time)
            else:
                raise RuntimeError("LLM circuit breaker is open. Please wait before retrying.")

        last_error = None
        for attempt in range(1, MAX_RETRIES + 1):
            start_time = time.time()
            try:
                parsed_output, provider = await invoke_structured_agent(
                    agent_id=agent_id,
                    task_prompt=system_prompt,
                    user_message=user_message,
                    output_model=output_model,
                    run_id=run_id,
                    temperature=temperature,
                )
                latency = (time.time() - start_time) * 1000
                logger.info(
                    f"[{run_id}] LangChain success | Agent: {agent_id} | "
                    f"Latency: {latency:.2f}ms | Attempt: {attempt}"
                )
                self.circuit_breaker["failures"] = 0
                return parsed_output, provider

            except Exception as e:
                last_error = e
                error_str = str(e)
                is_rate_limit = any(
                    code in error_str for code in ["429", "413", "rate_limit", "tokens per minute"]
                )
                is_parse_error = any(
                    term in error_str.lower() for term in ["validation", "json", "parse"]
                )

                if is_rate_limit and attempt < MAX_RETRIES:
                    delay = RETRY_DELAY_SECONDS * attempt
                    logger.warning(
                        f"[{run_id}] Rate limit (attempt {attempt}/{MAX_RETRIES}). Waiting {delay}s..."
                    )
                    await asyncio.sleep(delay)
                    continue

                if is_parse_error and attempt < MAX_RETRIES:
                    logger.warning(
                        f"[{run_id}] Parse error (attempt {attempt}/{MAX_RETRIES}). Retrying..."
                    )
                    await asyncio.sleep(2)
                    continue

                logger.error(f"[{run_id}] LangChain agent failed: {error_str}")
                self.circuit_breaker["failures"] += 1
                self.circuit_breaker["last_failure"] = time.time()
                if self.circuit_breaker["failures"] >= 5:
                    self.circuit_breaker["open_until"] = time.time() + 60
                    logger.critical(f"[{run_id}] LLM CIRCUIT BREAKER OPENED")
                raise

        raise last_error


llm_router = LLMRouter()


async def call_with_fallback(*args, **kwargs):
    return await llm_router.complete(*args, **kwargs)
