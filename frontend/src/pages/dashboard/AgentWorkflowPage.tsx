import { useState, useEffect, useRef, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
 Activity, 
 ShieldCheck,
 Brain,
 Info,
 XCircle,
 AlertTriangle
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { WORKFLOW_AGENTS } from '../../constants/workflow'
import { WorkflowPhase } from '../../types/workflow'
import WorkflowProgressBar from '../../components/workflows/WorkflowProgressBar'
import AgentStageRunning from '../../components/workflows/AgentStageRunning'
import AgentStageReport from '../../components/workflows/AgentStageReport'
import { useRunStream } from '../../hooks/useRunStream'
import { useRunStore } from '../../store/runStore'
import toast from 'react-hot-toast'

export default function AgentWorkflowPage() {
 const [searchParams] = useSearchParams()
 const runId = searchParams.get('run_id')
 const navigate = useNavigate()
 
 // Connect to the real-time stream
 const { agentStates, logs, progress, status, engineData } = useRunStream(runId)
 const pendingApproval = useRunStore(state => state.pendingApproval)
 const currentStage = useRunStore(state => state.currentStage)
 const approveRun = useRunStore(state => state.approveRun)
 const cancelRun = useRunStore(state => state.cancelRun)
 
 // Determine active step based on backend current_stage
 const activeStep = useMemo(() => {
 const stages = WORKFLOW_AGENTS.map(a => a.id)
 
 // Use the backend's current_stage as the source of truth
 if (currentStage) {
 const idx = stages.indexOf(currentStage)
 if (idx !== -1) return idx
 }

 // Fallback: find the latest agent that is not 'pending'
 for (let i = stages.length - 1; i >= 0; i--) {
 if (agentStates[stages[i]] && agentStates[stages[i]].status !== 'pending') {
 return i
 }
 }
 return 0
 }, [agentStates, currentStage])

 const agent = WORKFLOW_AGENTS[activeStep]
 const agentState = agentStates[agent.id] || { status: 'pending', progress_pct: 0 }
 
 // Determine phase: show report if the agent is done (pending approval) or failed
 const phase: WorkflowPhase = useMemo(() => {
 // If backend explicitly says we need approval for this stage, show report
 if (pendingApproval && currentStage === agent.id) return 'reporting'
 // If agent status is done or failed, show report
 if (agentState.status === 'done' || agentState.status === 'failed') return 'reporting'
 return 'running'
 }, [pendingApproval, currentStage, agent.id, agentState.status])
 
 // Transform Backend Engine Data to Frontend Report Format
 const realOutput = useMemo(() => {
 const data = engineData?.[agent.id];
 if (!data) return null;

 switch(agent.id) {
 case 'product_intelligence':
 return {
 summary_stats: [
 { label: 'Product', value: data.product_name || 'N/A' },
 { label: 'Trend Score', value: `${data.trend_score}/100` },
 { label: 'Demand', value: `${data.demand_score}/100` },
 { label: 'Competition', value: `${data.competition_score}/100` },
 { label: 'Est. Margin', value: `${data.estimated_margin}%` },
 { label: 'Risk Level', value: data.risk_level || 'N/A' }
 ],
 reasoning_summary: data.reasoning,
 recommendations: data.evidence_sources
 };
 case 'competitor_intelligence':
 return {
 summary_stats: [
 { label: 'Saturation', value: `${data.market_saturation_score}/100` },
 { label: 'Pricing Gaps', value: `${data.pricing_gaps?.length || 0} found` },
 { label: 'SEO Gaps', value: `${data.SEO_gaps?.length || 0} found` }
 ],
 reasoning_summary: data.product_opportunities?.join('. ') || 'Opportunities identified.',
 recommendations: data.competitor_weaknesses
 };
 case 'product_sourcing':
 return {
 summary_stats: [
 { label: 'Best Price', value: `$${data.best_option?.price_per_unit}` },
 { label: 'Shipping', value: data.best_option?.shipping_time },
 { label: 'Profit Est.', value: `${data.profit_margin_estimate}%` }
 ],
 reasoning_summary: data.reasoning,
 recommendations: [`Supplier: ${data.best_option?.supplier_name}`, `Platform: ${data.best_option?.platform}`]
 };
 case 'commerce_creation':
 return {
 summary_stats: [
 { label: 'Ad Hooks', value: `${data.ad_copy_hooks?.length || 0}` },
 { label: 'SEO Tags', value: `${data.tags?.length || 0}` },
 { label: 'Images', value: `${data.generated_image_urls?.length || 0}` }
 ],
 reasoning_summary: data.product_description,
 recommendations: data.seo_titles
 };
 case 'meta_ads_spy':
 return {
 summary_stats: [
 { label: 'Active Ads', value: `${data.active_ads?.length || 0}` },
 { label: 'Top Hooks', value: `${data.winning_hooks?.length || 0}` },
 { label: 'Competitors', value: `${data.top_competitors_tracked?.length || 0}` }
 ],
 reasoning_summary: data.recommended_strategy,
 recommendations: data.winning_hooks
 };
 case 'deployment':
 return {
 summary_stats: [
 { label: 'Status', value: data.status || 'Pending' },
 { label: 'Rollback', value: data.rollback_available ? 'Available' : 'N/A' },
 { label: 'Store URL', value: data.listing_url ? 'Live' : 'Pending' }
 ],
 reasoning_summary: data.deployment_log?.join(' → ') || 'Deployment complete.',
 recommendations: [data.listing_url || 'Awaiting deployment']
 };
 default:
 return null;
 }
 }, [engineData, agent.id]);

 const researchData = useMemo(() => {
 return engineData?.[`${agent.id}_research`] || null;
 }, [engineData, agent.id]);

 const scrollRef = useRef<HTMLDivElement>(null)

 useEffect(() => {
 if (scrollRef.current) {
 scrollRef.current.scrollTop = scrollRef.current.scrollHeight
 }
 }, [logs])

 const handleApprove = async () => {
 if (runId) {
 await approveRun(runId)
 toast.success('Strategy Approved. Moving to next phase.')
 }
 }

 const handleCancel = async () => {
 if (runId && confirm('Are you sure you want to ABORT this mission? All active agents will be terminated.')) {
 await cancelRun(runId)
 toast.error('Mission Terminated.')
 navigate('/dashboard/run/new')
 }
 }

 // Filter logs for current agent
 const agentLogs = useMemo(() => {
 return logs
 .filter(l => l.agent_id === agent.id || l.agent_id === 'system')
 .map(l => `[${new Date(l.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}] ${l.message}`)
 }, [logs, agent.id])

 if (!runId) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
 <div className="w-16 h-16 rounded-full bg-landing-surface flex items-center justify-center text-landing-muted">
 <Info size={32} />
 </div>
 <h2 className="text-xl font-bold text-landing-primary">No active scan</h2>
 <button onClick={() => navigate('/dashboard/run/new')} className="cta-button px-8 h-12 rounded-xl">Start New Scan</button>
 </div>
 )
 }

 return (
 <div className="max-w-[1400px] mx-auto space-y-12 pb-24 px-4 md:px-8">
 <div className="flex items-center justify-between">
 <WorkflowProgressBar agents={WORKFLOW_AGENTS} activeStep={activeStep} />
 <button 
 onClick={handleCancel}
 className="ml-8 px-6 h-12 rounded-xl bg-accent-rose/10 border border-accent-rose/20 text-accent-rose text-xs font-black tracking-tight hover:bg-accent-rose hover:text-landing-primary transition-all flex items-center gap-2 group shrink-0"
 >
 <XCircle size={16} /> Cancel Scan
 </button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
 <div className="lg:col-span-2 space-y-8">
 <header className="space-y-4">
 <div className="flex items-center gap-4">
 <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border", `bg-accent-${agent.color}/10 border-accent-${agent.color}/20 text-accent-${agent.color}`)}>
 <agent.icon size={24} />
 </div>
 <div>
 <h2 className="text-3xl font-black text-landing-primary tracking-tight">{agent.name}</h2>
 <p className="text-sm text-landing-muted font-medium tracking-widest uppercase">Phase {activeStep + 1} of {WORKFLOW_AGENTS.length}</p>
 </div>
 </div>
 <p className="text-lg text-landing-secondary font-medium leading-relaxed max-w-xl">
 {agent.description}
 </p>
 </header>

 <AnimatePresence mode="wait">
 {phase === 'running' ? (
 <AgentStageRunning 
 agent={agent} 
 progress={agentState.progress_pct} 
 logs={agentLogs} 
 scrollRef={scrollRef} 
 />
 ) : (
 <AgentStageReport 
 agent={agent} 
 activeStep={activeStep} 
 totalSteps={WORKFLOW_AGENTS.length} 
 onApprove={handleApprove} 
 realOutput={realOutput}
 researchData={researchData}
 fullEngineData={engineData}
 />
 )}
 </AnimatePresence>
 </div>

 <div className="space-y-8">
 {status === 'failed' && (
 <div className="p-6 rounded-[32px] bg-accent-rose/10 border border-accent-rose/20 space-y-4">
 <div className="flex items-center gap-3 text-accent-rose">
 <AlertTriangle size={20} />
 <h3 className="text-xs font-black tracking-tight">Workflow Halted</h3>
 </div>
 <p className="text-xs text-landing-secondary leading-relaxed font-medium">
 Agents encountered a critical error. Please check your API keys or source connectivity.
 </p>
 <button onClick={() => navigate('/dashboard/run/new')} className="w-full h-10 rounded-xl bg-accent-rose text-white text-[10px] font-black uppercase">Restart Setup</button>
 </div>
 )}

 <div className="glass-panel p-8 space-y-8">
 <div className="flex items-center gap-3">
 <Activity size={20} className="text-landing-accent" />
 <h3 className="text-[10px] font-black text-landing-primary tracking-tight">System Health</h3>
 </div>
 
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-landing-muted">Core Sync</span>
 <span className="text-xs font-black text-accent-emerald">OPTIMAL</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-landing-muted">LLM Provider</span>
 <span className="text-xs font-black text-landing-primary">{agentState.llm_provider_used || 'N/A'}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-landing-muted">Confidence</span>
 <span className="text-xs font-black text-landing-primary">{agentState.confidence_score ? `${(agentState.confidence_score * 100).toFixed(1)}%` : 'N/A'}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-landing-muted">Stage</span>
 <span className="text-xs font-black text-accent-cyan">{currentStage ? currentStage.replace(/_/g, ' ').toUpperCase() : 'INITIALIZING'}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-landing-muted">Approval</span>
 <span className={cn("text-xs font-black", pendingApproval ? 'text-accent-amber' : 'text-landing-muted')}>{pendingApproval ? 'AWAITING' : 'N/A'}</span>
 </div>
 </div>
 </div>

 <div className="glass-panel p-8 bg-gradient-to-br from-accent-primary/5 to-transparent border-landing-accent/20 space-y-6">
 <div className="flex items-center gap-3 text-landing-accent">
 <Brain size={20} />
 <h3 className="text-[10px] font-black text-landing-primary tracking-tight">AI Reasoning</h3>
 </div>
 <p className="text-xs text-landing-secondary font-medium leading-relaxed">
 {agentState.sub_task || `The ${agent.name} engine is currently analyzing signals and optimizing the campaign strategy based on mission parameters.`}
 </p>
 </div>

 <div className="p-8 rounded-[32px] bg-landing-surface border border-dashed border-landing-divider flex flex-col items-center text-center space-y-4">
 <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", pendingApproval ? 'bg-accent-amber/10 text-accent-amber' : 'bg-landing-surface text-landing-muted')}>
 <ShieldCheck size={32} />
 </div>
 <div className="space-y-1">
 <p className="text-xs font-black text-landing-primary tracking-tight">Human in the Loop</p>
 <p className="text-[10px] text-landing-muted font-medium">
 {pendingApproval 
 ? 'Agent has completed analysis. Your approval is required to proceed.' 
 : 'Mission requires explicit manual authorization for state transitions.'}
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>
 )
}
