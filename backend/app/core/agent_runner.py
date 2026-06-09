import logging
import asyncio
import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List

from ..models.schemas import (
    WorkflowState,
    EngineStage,
    ProductIntelligenceOutput,
    CompetitorIntelligenceOutput,
    ProductSourcingOutput,
    CommerceCreationOutput,
    SupplierInfo,
)
from ..models.models import (
    StageIntelligenceData,
    StageCompetitorData,
    StageSourcingData,
    StageCommerceData,
    StageResearchSource,
    Run,
)
from ..engines.product_intelligence import ProductIntelligenceEngine
from ..engines.competitor_intelligence import CompetitorIntelligenceEngine
from ..engines.product_sourcing import ProductSourcingEngine
from ..engines.commerce_creation import CommerceCreationEngine
from ..engines.meta_ads_spy import MetaAdsSpyEngine

logger = logging.getLogger(__name__)

STAGE_LABELS = {
    EngineStage.PRODUCT_INTELLIGENCE.value: "Product Discovery",
    EngineStage.COMPETITOR_INTELLIGENCE.value: "Competitor Intel",
    EngineStage.PRODUCT_SOURCING.value: "Sourcing",
    EngineStage.COMMERCE_CREATION.value: "Store Builder",
    EngineStage.META_ADS_SPY.value: "Ad Creative",
}

IMPORTABLE_AGENTS = {
    EngineStage.COMPETITOR_INTELLIGENCE.value,
    EngineStage.PRODUCT_SOURCING.value,
}

STAGE_PREREQUISITES = {
    EngineStage.COMPETITOR_INTELLIGENCE.value: [EngineStage.PRODUCT_INTELLIGENCE.value],
    EngineStage.PRODUCT_SOURCING.value: [EngineStage.PRODUCT_INTELLIGENCE.value],
    EngineStage.COMMERCE_CREATION.value: [
        EngineStage.PRODUCT_INTELLIGENCE.value,
        EngineStage.COMPETITOR_INTELLIGENCE.value,
        EngineStage.PRODUCT_SOURCING.value,
    ],
    EngineStage.META_ADS_SPY.value: [EngineStage.PRODUCT_INTELLIGENCE.value],
}

STAGE_EXECUTORS = {
    EngineStage.PRODUCT_INTELLIGENCE.value: "_execute_product_intelligence",
    EngineStage.COMPETITOR_INTELLIGENCE.value: "_execute_competitor_intelligence",
    EngineStage.PRODUCT_SOURCING.value: "_execute_product_sourcing",
    EngineStage.COMMERCE_CREATION.value: "_execute_commerce_creation",
    EngineStage.META_ADS_SPY.value: "_execute_meta_ads_spy",
}


class AgentRunner:
    """Runs a single agent stage independently — no pipeline chaining."""

    def __init__(self, run_id: str, db: Optional[Any] = None):
        self.run_id = run_id
        self.db = db
        self._consumers: List[asyncio.Queue] = []
        self.lock = asyncio.Lock()
        self.state = WorkflowState(
            status="stopped",
            current_stage="",
            pending_approval=False,
            next_action="Start agent",
            engine_data={},
        )
        self.product_engine = ProductIntelligenceEngine()
        self.competitor_engine = CompetitorIntelligenceEngine()
        self.sourcing_engine = ProductSourcingEngine()
        self.creation_engine = CommerceCreationEngine()
        self.meta_ads_engine = MetaAdsSpyEngine()

    async def _broadcast(self, event: Dict[str, Any]):
        for consumer in self._consumers:
            try:
                await consumer.put(event)
            except Exception:
                pass

    def add_consumer(self, queue: asyncio.Queue):
        self._consumers.append(queue)

    def remove_consumer(self, queue: asyncio.Queue):
        if queue in self._consumers:
            self._consumers.remove(queue)

    async def log_and_stream(
        self,
        message: str,
        level: str = "info",
        stage: str = "system",
        metadata: Dict[str, Any] = None,
    ):
        log_data = {
            "run_id": self.run_id,
            "agent_id": metadata.get("agent_id", stage) if metadata else stage,
            "status": metadata.get("status", "running") if metadata else "running",
            "sub_task": message,
            "progress_pct": metadata.get("progress_pct", 0) if metadata else 0,
            "confidence_score": metadata.get("confidence_score", 0.95) if metadata else 0.95,
            "llm_provider_used": metadata.get("llm_provider", "groq") if metadata else "groq",
            "timestamp": datetime.now().isoformat(),
        }

        if level == "error":
            logger.error(message)
        else:
            logger.info(message)

        await self._broadcast({"event": "agent_update", "data": log_data})

    async def stream_state_update(self):
        await self._broadcast({"event": "state_update", "data": self.state.model_dump()})

    async def broadcast_state_update(self):
        await self.stream_state_update()

    @classmethod
    async def from_db(cls, run_id: str, db: Any) -> "AgentRunner":
        from sqlalchemy import select

        uid = uuid.UUID(run_id) if isinstance(run_id, str) else run_id
        query = select(Run).where(Run.id == uid)
        result = await db.execute(query)
        db_run = result.scalar_one_or_none()

        if not db_run:
            raise ValueError(f"Run {run_id} not found in database")

        instance = cls(run_id=str(db_run.id), db=db)
        instance.state = WorkflowState(
            status=db_run.status,
            current_stage=db_run.current_stage or "",
            pending_approval=db_run.pending_approval,
            next_action="View results",
            engine_data=db_run.engine_data or {},
        )
        return instance

    async def _update_db_state(self):
        if self.db:
            from sqlalchemy import update

            uid = uuid.UUID(self.run_id) if isinstance(self.run_id, str) else self.run_id
            state_dict = self.state.model_dump()

            stmt = update(Run).where(Run.id == uid).values(
                status=self.state.status,
                current_stage=self.state.current_stage,
                engine_data=state_dict["engine_data"],
                pending_approval=self.state.pending_approval,
            )
            await self.db.execute(stmt)
            await self.db.commit()

        await self.stream_state_update()

    @staticmethod
    def import_prerequisites(target_stage: str, source_engine_data: Dict[str, Any]) -> Dict[str, Any]:
        imported: Dict[str, Any] = {}
        for prereq in STAGE_PREREQUISITES.get(target_stage, []):
            if prereq in source_engine_data:
                imported[prereq] = source_engine_data[prereq]
                research_key = f"{prereq}_research"
                if research_key in source_engine_data:
                    imported[research_key] = source_engine_data[research_key]
        return imported

    @staticmethod
    def get_discovered_product(engine_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if engine_data.get("selected_product"):
            return engine_data["selected_product"]
        pi = engine_data.get(EngineStage.PRODUCT_INTELLIGENCE.value)
        if isinstance(pi, dict):
            return pi
        return None

    async def select_product(self, product: ProductIntelligenceOutput):
        stage = EngineStage.PRODUCT_INTELLIGENCE.value
        self.state.engine_data[stage] = product.model_dump()
        self.state.engine_data["selected_product"] = product.model_dump()
        await self._update_db_state()
        return {"status": "product_selected", "product_name": product.product_name}

    def _create_stub_product(self, query: str) -> ProductIntelligenceOutput:
        return ProductIntelligenceOutput(
            product_name=query,
            product_category="Uncategorized",
            trend_score=50,
            demand_score=50,
            competition_score=50,
            estimated_margin=30.0,
            risk_level="medium",
            evidence_sources=[],
            reasoning=f"Manual product entry for: {query}",
        )

    async def start_agent(
        self,
        stage: str,
        input_data: Dict[str, Any],
        source_engine_data: Optional[Dict[str, Any]] = None,
    ):
        self.state.status = "running"
        self.state.current_stage = stage
        self.state.engine_data["initial_input"] = input_data

        if source_engine_data:
            imported = self.import_prerequisites(stage, source_engine_data)
            self.state.engine_data.update(imported)
            product = self.get_discovered_product(source_engine_data)
            if product:
                self.state.engine_data["selected_product"] = product
                if EngineStage.PRODUCT_INTELLIGENCE.value not in self.state.engine_data:
                    self.state.engine_data[EngineStage.PRODUCT_INTELLIGENCE.value] = product

        product_stage = EngineStage.PRODUCT_INTELLIGENCE.value
        if stage != product_stage and product_stage not in self.state.engine_data:
            query = input_data.get("query") or input_data.get("product_name") or "Unknown Product"
            stub = self._create_stub_product(query)
            self.state.engine_data[product_stage] = stub.model_dump()
            self.state.engine_data["selected_product"] = stub.model_dump()

        await self._update_db_state()

        executor_name = STAGE_EXECUTORS.get(stage)
        if not executor_name:
            raise ValueError(f"Unknown agent stage: {stage}")

        async with self.lock:
            try:
                await getattr(self, executor_name)()
            except Exception as e:
                self.state.status = "failed"
                self.state.engine_data["last_error"] = str(e)
                await self.log_and_stream(f"Agent failed: {str(e)}", level="error", stage=stage)
                await self._update_db_state()
                return

        if self.state.status == "failed":
            return

        label = STAGE_LABELS.get(stage, stage)
        self.state.status = "completed"
        self.state.pending_approval = False
        self.state.next_action = "Completed"
        await self.log_and_stream(f"{label} completed successfully.", stage=stage)
        await self._update_db_state()

    async def pause_workflow(self):
        self.state.status = "paused"
        await self._update_db_state()
        return {"status": "Paused"}

    async def stop_workflow(self):
        self.state.status = "stopped"
        await self._update_db_state()
        return {"status": "Stopped"}

    async def _save_stage_research_to_db(self, stage_name: str, research_summary: List[Dict]):
        if not self.db:
            return

        try:
            for item in research_summary:
                db_item = StageResearchSource(
                    run_id=uuid.UUID(self.run_id),
                    stage=stage_name,
                    source_type=item.get("source", "Unknown"),
                    status=item.get("status", "unknown"),
                    item_count=item.get("count", 0),
                    highlights=item.get("highlights", []),
                )
                self.db.add(db_item)
            await self.db.commit()
        except Exception as e:
            logger.error(f"Failed to save research sources: {e}")
            await self.db.rollback()

    def _get_stage_data(self, stage: str, model_cls: Any) -> Any:
        data = self.state.engine_data.get(stage)
        if isinstance(data, dict):
            return model_cls.model_validate(data)
        return data

    def _stub_competitor_data(self, product: ProductIntelligenceOutput) -> CompetitorIntelligenceOutput:
        return CompetitorIntelligenceOutput(
            competitor_weaknesses=["Limited differentiation in current market"],
            pricing_gaps=["Mid-tier pricing opportunity"],
            SEO_gaps=["Long-tail keyword gaps"],
            product_opportunities=[f"Position {product.product_name} with stronger value props"],
            market_saturation_score=min(product.competition_score, 100),
        )

    def _stub_sourcing_data(self, product: ProductIntelligenceOutput) -> ProductSourcingOutput:
        stub_supplier = SupplierInfo(
            supplier_name="TBD Supplier",
            platform="AliExpress",
            price_per_unit=10.0,
            moq=1,
            shipping_time="10-15 days",
            supplier_rating=4.5,
            product_url="",
        )
        return ProductSourcingOutput(
            suppliers=[stub_supplier],
            best_option=stub_supplier,
            profit_margin_estimate=product.estimated_margin,
            sourcing_risk_level=product.risk_level,
            reasoning="Stub sourcing data — run Sourcing Agent for supplier matches.",
        )

    async def _execute_product_intelligence(self):
        stage = EngineStage.PRODUCT_INTELLIGENCE.value
        label = STAGE_LABELS[stage]
        query = self.state.engine_data["initial_input"].get("query", "")
        await self.log_and_stream(
            f"Starting {label} for: {query}",
            stage=stage,
            metadata={"agent_id": stage, "status": "running", "progress_pct": 5},
        )

        async def on_progress(message: str, pct: int):
            await self.log_and_stream(
                message,
                stage=stage,
                metadata={"agent_id": stage, "status": "running", "progress_pct": pct},
            )

        try:
            result = await self.product_engine.run(
                self.state.engine_data.get("initial_input"),
                run_id=self.run_id,
                on_progress=on_progress,
            )
            self.state.engine_data[stage] = result.model_dump()
            self.state.engine_data["selected_product"] = result.model_dump()
            self.state.engine_data[f"{stage}_research"] = self.product_engine.research_summary
            await self.log_and_stream(
                f"{label} complete: {result.product_name}",
                stage=stage,
                metadata={"agent_id": stage, "status": "done", "progress_pct": 100},
            )

            if self.db:
                try:
                    self.db.add(StageIntelligenceData(
                        run_id=uuid.UUID(self.run_id),
                        product_name=result.product_name,
                        product_category=result.product_category,
                        trend_score=result.trend_score,
                        demand_score=result.demand_score,
                        competition_score=result.competition_score,
                        estimated_margin=result.estimated_margin,
                        risk_level=result.risk_level,
                        reasoning=result.reasoning,
                    ))
                    await self.db.commit()
                    await self._save_stage_research_to_db(stage, self.product_engine.research_summary)
                except Exception as e:
                    logger.error(f"Failed to save product intelligence: {e}")
                    await self.db.rollback()
        except Exception as e:
            await self.log_and_stream(f"{label} failed: {str(e)}", level="error", stage=stage)
            self.state.status = "failed"
            await self._update_db_state()

    async def _execute_competitor_intelligence(self):
        stage = EngineStage.COMPETITOR_INTELLIGENCE.value
        label = STAGE_LABELS[stage]
        product_data = self._get_stage_data(EngineStage.PRODUCT_INTELLIGENCE.value, ProductIntelligenceOutput)
        await self.log_and_stream(f"Starting {label} for: {product_data.product_name}", stage=stage)

        try:
            result = await self.competitor_engine.run(
                product_data,
                self.state.engine_data.get("initial_input", {}),
            )
            self.state.engine_data[stage] = result.model_dump()
            self.state.engine_data[f"{stage}_research"] = self.competitor_engine.research_summary
            await self.log_and_stream(f"{label} complete.", stage=stage)

            if self.db:
                try:
                    self.db.add(StageCompetitorData(
                        run_id=uuid.UUID(self.run_id),
                        market_saturation_score=result.market_saturation_score,
                        weaknesses=result.competitor_weaknesses,
                        pricing_gaps=result.pricing_gaps,
                        seo_gaps=result.SEO_gaps,
                        opportunities=result.product_opportunities,
                    ))
                    await self.db.commit()
                    await self._save_stage_research_to_db(stage, self.competitor_engine.research_summary)
                except Exception as e:
                    logger.error(f"Failed to save competitor intelligence: {e}")
                    await self.db.rollback()
        except Exception as e:
            await self.log_and_stream(f"{label} failed: {str(e)}", level="error", stage=stage)
            self.state.status = "failed"
            await self._update_db_state()

    async def _execute_product_sourcing(self):
        stage = EngineStage.PRODUCT_SOURCING.value
        label = STAGE_LABELS[stage]
        product_data = self._get_stage_data(EngineStage.PRODUCT_INTELLIGENCE.value, ProductIntelligenceOutput)
        await self.log_and_stream(f"Starting {label} for: {product_data.product_name}", stage=stage)

        try:
            result = await self.sourcing_engine.run(
                product_data,
                self.state.engine_data.get("initial_input", {}),
            )
            self.state.engine_data[stage] = result.model_dump()
            self.state.engine_data[f"{stage}_research"] = self.sourcing_engine.research_summary
            await self.log_and_stream(f"{label} complete.", stage=stage)

            if self.db:
                try:
                    self.db.add(StageSourcingData(
                        run_id=uuid.UUID(self.run_id),
                        best_supplier_name=result.best_option.supplier_name,
                        best_platform=result.best_option.platform,
                        best_price=result.best_option.price_per_unit,
                        best_shipping=result.best_option.shipping_time,
                        profit_margin_estimate=result.profit_margin_estimate,
                        risk_level=result.sourcing_risk_level,
                        reasoning=result.reasoning,
                        all_suppliers=[s.model_dump() for s in result.suppliers],
                    ))
                    await self.db.commit()
                    await self._save_stage_research_to_db(stage, self.sourcing_engine.research_summary)
                except Exception as e:
                    logger.error(f"Failed to save sourcing data: {e}")
                    await self.db.rollback()
        except Exception as e:
            await self.log_and_stream(f"{label} failed: {str(e)}", level="error", stage=stage)
            self.state.status = "failed"
            await self._update_db_state()

    async def _execute_commerce_creation(self):
        stage = EngineStage.COMMERCE_CREATION.value
        label = STAGE_LABELS[stage]
        product_data = self._get_stage_data(EngineStage.PRODUCT_INTELLIGENCE.value, ProductIntelligenceOutput)

        competitor_data = self.state.engine_data.get(EngineStage.COMPETITOR_INTELLIGENCE.value)
        sourcing_data = self.state.engine_data.get(EngineStage.PRODUCT_SOURCING.value)
        if competitor_data:
            competitor_data = CompetitorIntelligenceOutput.model_validate(competitor_data)
        else:
            competitor_data = self._stub_competitor_data(product_data)
        if sourcing_data:
            sourcing_data = ProductSourcingOutput.model_validate(sourcing_data)
        else:
            sourcing_data = self._stub_sourcing_data(product_data)

        await self.log_and_stream(f"Starting {label} for: {product_data.product_name}", stage=stage)

        try:
            result = await self.creation_engine.run(
                product_data,
                competitor_data,
                sourcing_data,
                self.state.engine_data.get("initial_input", {}),
            )
            self.state.engine_data[stage] = result.model_dump()
            await self.log_and_stream(f"{label} complete.", stage=stage)

            if self.db:
                try:
                    self.db.add(StageCommerceData(
                        run_id=uuid.UUID(self.run_id),
                        seo_titles=result.seo_titles,
                        product_description=result.product_description,
                        bullet_benefits=result.bullet_benefits,
                        tags=result.tags,
                        ad_copy_hooks=result.ad_copy_hooks,
                        image_urls=result.generated_image_urls,
                    ))
                    await self.db.commit()
                except Exception as e:
                    logger.error(f"Failed to save store builder data: {e}")
                    await self.db.rollback()
        except Exception as e:
            await self.log_and_stream(f"{label} failed: {str(e)}", level="error", stage=stage)
            self.state.status = "failed"
            await self._update_db_state()

    async def _execute_meta_ads_spy(self):
        stage = EngineStage.META_ADS_SPY.value
        label = STAGE_LABELS[stage]
        query = self.state.engine_data.get("initial_input", {}).get("query", "Unknown")

        product_name = query
        pi = self.state.engine_data.get(EngineStage.PRODUCT_INTELLIGENCE.value)
        if pi:
            product_name = pi.get("product_name", query) if isinstance(pi, dict) else query

        await self.log_and_stream(f"Starting {label} for: {product_name}", stage=stage)

        try:
            result = await self.meta_ads_engine.run(
                product_name,
                self.state.engine_data.get("initial_input", {}),
            )
            self.state.engine_data[stage] = result.model_dump()
            self.state.engine_data[f"{stage}_research"] = self.meta_ads_engine.research_summary
            await self.log_and_stream(f"{label} complete.", stage=stage)
        except Exception as e:
            await self.log_and_stream(f"{label} failed: {str(e)}", level="error", stage=stage)
            self.state.status = "failed"
            await self._update_db_state()


# Backward-compatible alias
Orchestrator = AgentRunner
