import time
import logging
import json
import asyncio
from groq import Groq
from typing import Any, Dict, List, Optional, Type, Tuple
from pydantic import BaseModel
from ..config import settings

logger = logging.getLogger(__name__)

# Maximum retries for rate-limit errors
MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 12  # Groq free tier resets per minute


class LLMRouter:
    def __init__(self):
        # Using Llama 3.1 8B Instant as the primary engine for maximum speed and modern performance
        self.providers = [
            {"name": "groq", "model": "llama-3.1-8b-instant"}
        ]
        
        if settings.GROQ_API_KEY:
            prefix = settings.GROQ_API_KEY[:8]
            logger.info(f"🚀 [LLM] Groq Core Active | Model: {self.providers[0]['model']} | Key: {prefix}...")
            self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
        else:
            logger.critical("❌ [LLM] FATAL: GROQ_API_KEY is missing. System cannot function.")
            self.groq_client = None
            
        self.circuit_breaker = {"failures": 0, "last_failure": 0, "open_until": 0}

    def _is_available(self) -> bool:
        if time.time() < self.circuit_breaker["open_until"]:
            return False
        return True

    def _extract_json(self, text: str) -> str:
        """Extract JSON string from potential markdown wrapping."""
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
        return text.strip()

    async def complete(
        self,
        agent_id: str,
        system_prompt: str,
        user_message: str,
        output_model: Type[BaseModel],
        run_id: str,
        temperature: float = 0.3
    ) -> Tuple[BaseModel, str]:
        
        if not self.groq_client:
            raise Exception("Groq client not initialized. Check GROQ_API_KEY.")

        if not self._is_available():
            # Wait for circuit breaker to reset instead of failing immediately
            wait_time = self.circuit_breaker["open_until"] - time.time()
            if wait_time > 0 and wait_time <= 60:
                logger.warning(f"[{run_id}] Circuit breaker active. Waiting {wait_time:.0f}s...")
                await asyncio.sleep(wait_time)
            else:
                raise Exception("Groq circuit breaker is open. Please wait before retrying.")

        last_error = None
        for attempt in range(1, MAX_RETRIES + 1):
            start_time = time.time()
            try:
                # Execute with modern Llama 3.1
                chat_completion = self.groq_client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message}
                    ],
                    model=self.providers[0]["model"],
                    response_format={"type": "json_object"},
                    temperature=temperature
                )
                raw_content = chat_completion.choices[0].message.content
                
                clean_content = self._extract_json(raw_content)
                parsed_output = output_model.model_validate_json(clean_content)
                
                latency = (time.time() - start_time) * 1000
                logger.info(
                    f"[{run_id}] LLM Success | Model: {self.providers[0]['model']} | Agent: {agent_id} | "
                    f"Latency: {latency:.2f}ms | Attempt: {attempt}"
                )
                
                self.circuit_breaker["failures"] = 0
                return parsed_output, "groq"

            except Exception as e:
                last_error = e
                error_str = str(e)
                
                # Check if it's a rate limit error (429 or 413) — retry with delay
                is_rate_limit = any(code in error_str for code in ["429", "413", "rate_limit", "tokens per minute"])
                
                if is_rate_limit and attempt < MAX_RETRIES:
                    delay = RETRY_DELAY_SECONDS * attempt
                    logger.warning(
                        f"[{run_id}] Rate limit hit (attempt {attempt}/{MAX_RETRIES}). "
                        f"Waiting {delay}s before retry..."
                    )
                    await asyncio.sleep(delay)
                    continue
                
                # Check if it's a JSON parsing error — retry once with same prompt
                is_parse_error = any(term in error_str for term in ["validation error", "json", "JSON"])
                if is_parse_error and attempt < MAX_RETRIES:
                    logger.warning(
                        f"[{run_id}] JSON parse error (attempt {attempt}/{MAX_RETRIES}). Retrying..."
                    )
                    await asyncio.sleep(2)
                    continue
                
                # Not retryable or exhausted retries
                logger.error(f"[{run_id}] Groq request failed ({self.providers[0]['model']}): {error_str}")
                self.circuit_breaker["failures"] += 1
                self.circuit_breaker["last_failure"] = time.time()
                
                if self.circuit_breaker["failures"] >= 5:
                    self.circuit_breaker["open_until"] = time.time() + 60
                    logger.critical(f"[{run_id}] GROQ CIRCUIT BREAKER OPENED")
                
                raise e

        # Should not reach here, but safety net
        raise last_error

llm_router = LLMRouter()

async def call_with_fallback(*args, **kwargs):
    return await llm_router.complete(*args, **kwargs)
