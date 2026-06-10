import logging
import json
from typing import Dict, Any, List, Optional
from ..models.schemas import ProductSourcingOutput, ProductIntelligenceOutput, SupplierInfo
from ..core.llm import call_with_fallback
from ..core.tools import research_tools
from ..core.result_normalizer import (
    MAX_ROWS,
    normalize_sourcing_options,
    mark_recommended_sourcing,
)

logger = logging.getLogger(__name__)

MAX_PROMPT_CHARS = 3500


class ProductSourcingEngine:
    def __init__(self):
        self.research_summary: List[Dict] = []
        self.sourcing_options: List[Dict[str, Any]] = []

    def _prune_data(self, data: Any, max_chars: int = 120) -> Any:
        if isinstance(data, dict):
            return {k: self._prune_data(v, max_chars) for k, v in data.items()}
        elif isinstance(data, list):
            return [self._prune_data(i, max_chars) for i in data]
        elif isinstance(data, str):
            return data[:max_chars].strip() + "..." if len(data) > max_chars else data
        return data

    async def run(
        self,
        product_data: ProductIntelligenceOutput,
        initial_input: Optional[Dict[str, Any]] = None,
    ) -> ProductSourcingOutput:
        initial_input = initial_input or {}
        product_name = product_data.product_name
        product_category = product_data.product_category
        logger.info(f"Starting Sourcing for: {product_name}")

        alibaba_results = await research_tools.search_alibaba(product_name, max_items=MAX_ROWS)
        aliexpress_results = await research_tools.search_aliexpress(product_name, max_items=MAX_ROWS)
        cj_results = await research_tools.search_cjdropshipping(product_name, max_items=MAX_ROWS)

        normalized = normalize_sourcing_options(cj_results, alibaba_results, aliexpress_results)

        self.research_summary = []
        if cj_results:
            self.research_summary.append({
                "source": "📦 CJ Dropshipping",
                "count": len(cj_results),
                "status": "found",
                "highlights": [
                    f"{r.get('title', '')[:50]} — ${r.get('price', 'N/A')}"
                    for r in cj_results[:3] if r
                ],
            })
        else:
            self.research_summary.append({"source": "📦 CJ Dropshipping", "count": 0, "status": "not_found", "highlights": []})

        if alibaba_results:
            self.research_summary.append({
                "source": "🏭 Alibaba",
                "count": len(alibaba_results),
                "status": "found",
                "highlights": [
                    f"{r.get('title', '')[:50]} — MOQ {r.get('moq', 'N/A')}"
                    for r in alibaba_results[:3] if r
                ],
            })
        else:
            self.research_summary.append({"source": "🏭 Alibaba", "count": 0, "status": "not_found", "highlights": []})

        if aliexpress_results:
            self.research_summary.append({
                "source": "📦 AliExpress",
                "count": len(aliexpress_results),
                "status": "found",
                "highlights": [
                    f"{r.get('title', '')[:50]} — {r.get('price', 'N/A')}"
                    for r in aliexpress_results[:3] if r
                ],
            })
        else:
            self.research_summary.append({"source": "📦 AliExpress", "count": 0, "status": "not_found", "highlights": []})

        if not normalized:
            logger.warning(f"No suppliers found for '{product_name}'.")
            self.sourcing_options = []
            return ProductSourcingOutput(
                suppliers=[],
                best_option=SupplierInfo(
                    supplier_name="Not Found",
                    platform="N/A",
                    price_per_unit=0.0,
                    moq=0,
                    shipping_time="N/A",
                    supplier_rating=0.0,
                    product_url="",
                    country=None,
                ),
                profit_margin_estimate=0.0,
                sourcing_risk_level="High",
                reasoning=(
                    f"No suppliers found for '{product_name}' on Alibaba, AliExpress, or CJ Dropshipping. "
                    "Manual sourcing recommended."
                ),
            )

        options_for_llm = [o.model_dump() for o in normalized[:MAX_ROWS]]
        sourcing_context = self._prune_data({"options": options_for_llm}, max_chars=150)

        condensed_persona = "You are a supply chain analyst. Vet suppliers carefully and prioritize margin and shipping speed."
        system_prompt = (
            f"{condensed_persona}\n"
            "Vet and secure 'Tier-1' supply chain partners."
            "\n\nOUTPUT: Valid JSON only. Raw numbers (no $ or units)."
            "\nSCHEMA:"
            "\n{"
            "\n  \"suppliers\": ["
            "\n    {\"supplier_name\":\"\",\"platform\":\"CJ Dropshipping\",\"price_per_unit\":0.0,\"moq\":1,"
            "\"shipping_time\":\"7-12 days\",\"supplier_rating\":4.8,\"product_url\":\"\",\"country\":\"China\"}"
            "\n  ],"
            "\n  \"best_option\": { same as supplier object },"
            "\n  \"profit_margin_estimate\": 35.0,"
            "\n  \"sourcing_risk_level\": \"Low\","
            "\n  \"reasoning\": \"Strategic explanation.\""
            "\n}"
        )

        data_json = json.dumps(sourcing_context, separators=(',', ':'))
        max_data_chars = MAX_PROMPT_CHARS - len(
            f"Product:{product_name}\nCategory:{product_category}\nTASK:Identify Best Sourcing Option. Return JSON.\nDATA:"
        )
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

        self.sourcing_options = mark_recommended_sourcing(
            normalized,
            output.best_option.supplier_name,
            output.best_option.product_url,
        )

        # Enrich LLM suppliers with country from normalized data when missing
        url_to_country = {o.product_url: o.country for o in normalized if o.product_url}
        for supplier in output.suppliers:
            if not supplier.country and supplier.product_url in url_to_country:
                supplier.country = url_to_country[supplier.product_url]
        if not output.best_option.country and output.best_option.product_url in url_to_country:
            output.best_option.country = url_to_country[output.best_option.product_url]

        logger.info(f"Sourcing completed using {provider} — {len(self.sourcing_options)} options")
        return output
