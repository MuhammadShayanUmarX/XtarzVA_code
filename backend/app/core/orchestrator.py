import logging
import asyncio
from datetime import datetime
from typing import Optional, Dict, Any, List
from ..models.schemas import (
    WorkflowState, EngineStage,
    ProductIntelligenceOutput, CompetitorIntelligenceOutput,
    ProductSourcingOutput, CommerceCreationOutput, SupplierInfo,
)
from ..models.models import (
    StageIntelligenceData, StageCompetitorData, StageSourcingData,
    StageCommerceData, StageResearchSource, Run,
)
import uuid
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


class Orchestrator:
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

    def __init__(self, run_id: str, db: Optional[Any] = None):
        self.run_id = run_id
        self.db = db
        self._consumers: List[asyncio.Queue] = []
        self.lock = asyncio.Lock()
        self.state = WorkflowState(
            status="stopped",
            current_stage="",
            pending_approval=False,
            next_action="Start workflow",
            engine_data={},
        )
        self.product_engine = ProductIntelligenceEngine()
        self.competitor_engine = CompetitorIntelligenceEngine()
        self.sourcing_engine = ProductSourcingEngine()
        self.creation_engine = CommerceCreationEngine()
        self.meta_ads_engine = MetaAdsSpyEngine()

    @classmethod
    async def from_db(cls, run_id: str, db: Any) -> "Orchestrator":
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
            next_action="Resume workflow",
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

    async def start_workflow(self, initial_input: Dict[str, Any]):
        self.state.status = "running"
        self.state.engine_data["initial_input"] = initial_input
        await self._update_db_state()
        await self.run_next_stage()

    async def start_standalone_stage(self, stage: str, input_data: Dict[str, Any]):
        self.state.status = "running"
        self.state.current_stage = stage
        self.state.engine_data["initial_input"] = input_data

        query = input_data.get("query", "Unknown Product")

        if stage == EngineStage.PRODUCT_SOURCING.value:
            self.state.engine_data[EngineStage.PRODUCT_INTELLIGENCE.value] = ProductIntelligenceOutput(
                product_name=query,
                product_category=input_data.get("category", "General"),
                trend_score=85, demand_score=85, competition_score=50,
                estimated_margin=40.0, risk_level="Medium",
                evidence_sources=[], reasoning="Standalone sourcing run.",
            )
            await self._update_db_state()
            await self._execute_product_sourcing()

        elif stage == EngineStage.COMMERCE_CREATION.value:
            self.state.engine_data[EngineStage.PRODUCT_INTELLIGENCE.value] = ProductIntelligenceOutput(
                product_name=query, product_category="General",
                trend_score=85, demand_score=85, competition_score=50,
                estimated_margin=40.0, risk_level="Medium",
                evidence_sources=[], reasoning="",
            )
            self.state.engine_data[EngineStage.COMPETITOR_INTELLIGENCE.value] = CompetitorIntelligenceOutput(
                market_saturation_score=50,
                competitor_weaknesses=["Generic positioning"],
                pricing_gaps=[], SEO_gaps=[], product_opportunities=["Branding"],
            )
            self.state.engine_data[EngineStage.PRODUCT_SOURCING.value] = ProductSourcingOutput(
                suppliers=[],
                best_option=SupplierInfo(
                    supplier_name="N/A", platform="N/A", price_per_unit=0,
                    moq=1, shipping_time="N/A", supplier_rating=0, product_url="",
                ),
                profit_margin_estimate=0, sourcing_risk_level="Low", reasoning="",
            )
            await self._update_db_state()
            await self._execute_commerce_creation()

        elif stage == EngineStage.PRODUCT_INTELLIGENCE.value:
            await self._update_db_state()
            await self._execute_product_intelligence()

        elif stage == EngineStage.COMPETITOR_INTELLIGENCE.value:
            self.state.engine_data[EngineStage.PRODUCT_INTELLIGENCE.value] = ProductIntelligenceOutput(
                product_name=query, product_category="General",
                trend_score=85, demand_score=85, competition_score=50,
                estimated_margin=40.0, risk_level="Low",
                evidence_sources=[], reasoning="",
            )
            await self._update_db_state()
            await self._execute_competitor_intelligence()

        elif stage == EngineStage.META_ADS_SPY.value:
            await self._update_db_state()
            await self._execute_meta_ads_spy()

        if self.state.status != "failed":
            self.state.status = "completed"
            self.state.pending_approval = False
            self.state.next_action = "Completed"
            label = STAGE_LABELS.get(stage, stage)
            await self.log_and_stream(f"{label} completed successfully.", stage=stage)
        await self._update_db_state()

    async def run_next_stage(self):
        async with self.lock:
            if self.state.status != "running":
                return

            try:
                if self.state.current_stage == "":
                    await self._execute_product_intelligence()
                elif self.state.current_stage == EngineStage.PRODUCT_INTELLIGENCE.value:
                    await self._execute_competitor_intelligence()
                elif self.state.current_stage == EngineStage.COMPETITOR_INTELLIGENCE.value:
                    await self._execute_product_sourcing()
                elif self.state.current_stage == EngineStage.PRODUCT_SOURCING.value:
                    await self._execute_commerce_creation()
                elif self.state.current_stage == EngineStage.COMMERCE_CREATION.value:
                    self.state.status = "completed"
                    self.state.pending_approval = False
                    self.state.next_action = "Completed"
                    await self.log_and_stream(
                        "Full workflow completed. All assets are ready.",
                        stage=EngineStage.COMMERCE_CREATION.value,
                    )
                    await self._update_db_state()
            except Exception as e:
                self.state.status = "failed"
                self.state.engine_data["last_error"] = str(e)
                await self.log_and_stream(f"Workflow failed: {str(e)}", level="error")
                await self._update_db_state()

    async def approve_stage(self):
        if not self.state.pending_approval:
            return {"error": "No pending approval"}

        self.state.pending_approval = False
        self.state.status = "running"
        await self._update_db_state()
        await self.run_next_stage()
        return {"status": "Approved, proceeding to next stage"}

    async def pause_workflow(self):
        self.state.status = "paused"
        await self._update_db_state()
        return {"status": "Paused"}

    async def resume_workflow(self):
        self.state.status = "running"
        await self._update_db_state()
        if self.state.pending_approval:
            return {"status": "Resumed, waiting for approval"}
        await self.run_next_stage()
        return {"status": "Resumed"}

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

    async def _execute_product_intelligence(self):
        stage = EngineStage.PRODUCT_INTELLIGENCE.value
        label = STAGE_LABELS[stage]
        self.state.current_stage = stage
        await self._update_db_state()

        query = self.state.engine_data["initial_input"].get("query", "")
        await self.log_and_stream(f"Starting {label} for: {query}", stage=stage)

        try:
            result = await self.product_engine.run(self.state.engine_data.get("initial_input"))
            self.state.engine_data[stage] = result
            self.state.engine_data[f"{stage}_research"] = self.product_engine.research_summary
            self.state.pending_approval = True
            self.state.status = "paused"
            self.state.next_action = "Review product research"
            await self.log_and_stream(f"{label} complete. Review results to continue.", stage=stage)

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
        self.state.current_stage = stage
        await self._update_db_state()

        product_data = self._get_stage_data(EngineStage.PRODUCT_INTELLIGENCE.value, ProductIntelligenceOutput)
        await self.log_and_stream(f"Starting {label} for: {product_data.product_name}", stage=stage)

        try:
            result = await self.competitor_engine.run(product_data)
            self.state.engine_data[stage] = result
            self.state.engine_data[f"{stage}_research"] = self.competitor_engine.research_summary
            self.state.pending_approval = True
            self.state.status = "paused"
            self.state.next_action = "Review competitor analysis"
            await self.log_and_stream(f"{label} complete. Review insights to continue.", stage=stage)

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
        self.state.current_stage = stage
        await self._update_db_state()

        product_data = self._get_stage_data(EngineStage.PRODUCT_INTELLIGENCE.value, ProductIntelligenceOutput)
        await self.log_and_stream(f"Starting {label} for: {product_data.product_name}", stage=stage)

        try:
            result = await self.sourcing_engine.run(product_data)
            self.state.engine_data[stage] = result
            self.state.engine_data[f"{stage}_research"] = self.sourcing_engine.research_summary
            self.state.pending_approval = True
            self.state.status = "paused"
            self.state.next_action = "Review supplier options"
            await self.log_and_stream(f"{label} complete. Review suppliers to continue.", stage=stage)

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
        self.state.current_stage = stage
        await self._update_db_state()

        product_data = self._get_stage_data(EngineStage.PRODUCT_INTELLIGENCE.value, ProductIntelligenceOutput)
        competitor_data = self._get_stage_data(EngineStage.COMPETITOR_INTELLIGENCE.value, CompetitorIntelligenceOutput)
        sourcing_data = self._get_stage_data(EngineStage.PRODUCT_SOURCING.value, ProductSourcingOutput)

        await self.log_and_stream(f"Starting {label} for: {product_data.product_name}", stage=stage)

        try:
            result = await self.creation_engine.run(product_data, competitor_data, sourcing_data)
            self.state.engine_data[stage] = result
            self.state.pending_approval = True
            self.state.status = "paused"
            self.state.next_action = "Review store content"
            await self.log_and_stream(f"{label} complete. Review generated content.", stage=stage)

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
        self.state.current_stage = stage
        await self._update_db_state()

        query = self.state.engine_data.get("initial_input", {}).get("query", "Unknown")
        await self.log_and_stream(f"Starting {label} for: {query}", stage=stage)

        try:
            result = await self.meta_ads_engine.run(query)
            self.state.engine_data[stage] = result
            self.state.pending_approval = False
            self.state.status = "completed"
            self.state.next_action = "Completed"
            await self.log_and_stream(f"{label} complete.", stage=stage)
        except Exception as e:
            await self.log_and_stream(f"{label} failed: {str(e)}", level="error", stage=stage)
            self.state.status = "failed"

        await self._update_db_state()
