import logging
import json
from typing import Dict, Any, List, Optional
from ..models.schemas import ProductSourcingOutput, ProductIntelligenceOutput, SupplierInfo
from ..core.llm import call_with_fallback
from ..core.tools import research_tools

logger = logging.getLogger(__name__)

MAX_PROMPT_CHARS = 3500


class ProductSourcingEngine:
    def __init__(self):
        self.research_summary = []

    def _prune_data(self, data: Any, max_chars: int = 120) -> Any:
        if isinstance(data, dict):
            return {k: self._prune_data(v, max_chars) for k, v in data.items()}
        elif isinstance(data, list):
            return [self._prune_data(i, max_chars) for i in data]
        elif isinstance(data, str):
            return data[:max_chars].strip() + "..." if len(data) > max_chars else data
        return data

    def _extract_key_fields(self, items: List[Dict], keys: List[str], max_items: int = 3) -> List[Dict]:
        extracted = []
        for item in items[:max_items]:
            if isinstance(item, dict):
                extracted.append({k: item.get(k, "") for k in keys if item.get(k)})
        return extracted

    async def run(
        self,
        product_data: ProductIntelligenceOutput,
        initial_input: Optional[Dict[str, Any]] = None,
    ) -> ProductSourcingOutput:
        initial_input = initial_input or {}
        product_name = product_data.product_name
        product_category = product_data.product_category
        logger.info(f"Starting Sourcing for: {product_name}")

        alibaba_results = await research_tools.search_alibaba(product_name)
        aliexpress_results = await research_tools.search_aliexpress(product_name)
        cj_results = await research_tools.search_cjdropshipping(product_name)

        # Build research summary for UI
        self.research_summary = []
        if cj_results:
            self.research_summary.append({
                "source": "📦 CJ Dropshipping",
                "count": len(cj_results),
                "status": "found",
                "highlights": [r.get("title", "")[:80] for r in cj_results[:3] if r]
            })
        else:
            self.research_summary.append({"source": "📦 CJ Dropshipping", "count": 0, "status": "not_found", "highlights": []})

        if alibaba_results:
            self.research_summary.append({
                "source": "🏭 Alibaba",
                "count": len(alibaba_results),
                "status": "found",
                "highlights": [r.get("title", r.get("content", ""))[:80] for r in alibaba_results[:3] if r]
            })
        else:
            self.research_summary.append({"source": "🏭 Alibaba", "count": 0, "status": "not_found", "highlights": []})

        if aliexpress_results:
            self.research_summary.append({
                "source": "📦 AliExpress",
                "count": len(aliexpress_results),
                "status": "found",
                "highlights": [r.get("title", r.get("content", ""))[:80] for r in aliexpress_results[:3] if r]
            })
        else:
            self.research_summary.append({"source": "📦 AliExpress", "count": 0, "status": "not_found", "highlights": []})

        # --- GRACEFUL "NOT FOUND" HANDLING ---
        if not any([alibaba_results, aliexpress_results, cj_results]):
            logger.warning(f"No suppliers found for '{product_name}'.")
            return ProductSourcingOutput(
                suppliers=[],
                best_option=SupplierInfo(
                    supplier_name="Not Found",
                    platform="N/A",
                    price_per_unit=0.0,
                    moq=0,
                    shipping_time="N/A",
                    supplier_rating=0.0,
                    product_url=""
                ),
                profit_margin_estimate=0.0,
                sourcing_risk_level="High",
                reasoning=f"No suppliers found for '{product_name}' on Alibaba, AliExpress, or CJ Dropshipping. Manual sourcing recommended. Consider contacting manufacturers directly."
            )

        # Extract key fields for LLM
        cj_slim = self._extract_key_fields(
            cj_results,
            ["url", "title", "price", "moq", "rating", "shipping", "supplier_name"],
            max_items=3
        )
        alibaba_slim = self._extract_key_fields(
            alibaba_results,
            ["url", "title", "price", "moq", "rating", "supplier_name"],
            max_items=3
        )
        aliexpress_slim = self._extract_key_fields(
            aliexpress_results,
            ["url", "title", "price", "orders", "rating", "shipping"],
            max_items=3
        )

        sourcing_context = self._prune_data({
            "cjdropshipping": cj_slim, "alibaba": alibaba_slim, "aliexpress": aliexpress_slim
        }, max_chars=120)

        condensed_persona = "You are a supply chain analyst. Vet suppliers carefully and prioritize margin and shipping speed."
        system_prompt = (
            f"{condensed_persona}\n"
            "Vet and secure 'Tier-1' supply chain partners."
            "\n\nOUTPUT: Valid JSON only. Raw numbers (no $ or units)."
            "\nSCHEMA:"
            "\n{"
            "\n  \"suppliers\": ["
            "\n    {\"supplier_name\":\"\",\"platform\":\"CJ Dropshipping\",\"price_per_unit\":0.0,\"moq\":1,\"shipping_time\":\"7-12 days\",\"supplier_rating\":4.8,\"product_url\":\"\"}"
            "\n  ],"
            "\n  \"best_option\": { same as supplier object },"
            "\n  \"profit_margin_estimate\": 35.0,"
            "\n  \"sourcing_risk_level\": \"Low\","
            "\n  \"reasoning\": \"Strategic explanation.\""
            "\n}"
        )

        data_json = json.dumps(sourcing_context, separators=(',', ':'))
        max_data_chars = MAX_PROMPT_CHARS - len(f"Product:{product_name}\nCategory:{product_category}\nTASK:Identify Best Sourcing Option. Return JSON.\nDATA:")
        if len(data_json) > max_data_chars:
            data_json = data_json[:max_data_chars]

        constraints = []
        if initial_input.get("target_cost"):
            constraints.append(f"Target unit cost: {initial_input['target_cost']}")
        if initial_input.get("moq_preference"):
            constraints.append(f"MOQ preference: {initial_input['moq_preference']}")
        if initial_input.get("shipping_region"):
            constraints.append(f"Ship to: {initial_input['shipping_region']}")
        constraint_text = "\n".join(constraints)

        user_prompt = (
            f"Product:{product_name}\n"
            f"Category:{product_category}\n"
            + (f"CONSTRAINTS:\n{constraint_text}\n" if constraint_text else "")
            + f"DATA:{data_json}\n"
            "TASK:Identify Best Sourcing Option. Return JSON."
        )

        output, provider = await call_with_fallback(
            "product_sourcing", system_prompt, user_prompt, ProductSourcingOutput, "system_run"
        )

        logger.info(f"Sourcing completed using {provider}")
        return output
