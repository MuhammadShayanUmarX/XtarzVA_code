import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
 ChevronLeft,
 ChevronRight, 
 Terminal as TerminalIcon, 
 Cpu, 
 Zap, 
 ShieldCheck, 
 Activity, 
 Search, 
 Target, 
 BarChart2, 
 Package, 
 TrendingUp,
 Settings,
 Play,
 Square,
 RefreshCcw,
 MessageSquare,
 Globe,
 Database,
 Lock
} from 'lucide-react'
import { cn } from '../../lib/utils'
import api from '../../lib/api'
import { RunStreamClient } from '../../lib/runStream'
import toast from 'react-hot-toast'

const AGENTS_CONFIG: Record<string, any> = {
 product_intelligence: { name: 'Product Intelligence', icon: Search, color: 'cyan', role: 'Market Discovery & Trend Analysis' },
 competitor_intelligence: { name: 'Competitor Intelligence', icon: Target, color: 'rose', role: 'Competitor Benchmarking & Pricing' },
 product_sourcing: { name: 'Product Sourcing', icon: Package, color: 'indigo', role: 'Supplier Verification & Cost Analysis' },
 meta_ads_spy: { name: 'Ad Creative', icon: Zap, color: 'violet', role: 'SEO, Product Copy, Tags & Ad Creatives' },
 commerce_creation: { name: 'Store Builder', icon: TrendingUp, color: 'emerald', role: 'Shopify OS 2.0 Theme Generation' },
}

export default function AgentConsolePage() {
 const { agentId } = useParams<{ agentId: string }>()
 const navigate = useNavigate()
 const agent = AGENTS_CONFIG[agentId || 'product_intelligence'] || AGENTS_CONFIG.product_intelligence
 
 const [logs, setLogs] = useState<string[]>([
 `[SYSTEM] Initializing ${agent.name} core protocols...`,
 `[SYSTEM] Establishing secure neural link to ${agentId}-node-us-east...`,
 `[SYSTEM] Connected. Status: OPTIMAL`,
 ])
 
 const [status, setStatus] = useState<'active' | 'idle' | 'error'>('idle')
 const [activeRunId, setActiveRunId] = useState<string | null>(null)
 const [client, setClient] = useState<RunStreamClient | null>(null)
 const scrollRef = useRef<HTMLDivElement>(null)

 useEffect(() => {
 if (scrollRef.current) {
 scrollRef.current.scrollTop = scrollRef.current.scrollHeight
 }
 }, [logs])

 useEffect(() => {
 if (!activeRunId) return
 
 const streamClient = new RunStreamClient(activeRunId)
 setClient(streamClient)
 setStatus('active')
 
 streamClient.connect({
 onAgentUpdate: (event) => {
 const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
 if (event.sub_task) {
 setLogs(prev => [...prev.slice(-100), `[${timestamp}] [${event.agent_id}] ${event.sub_task}`])
 }
 if (event.status === 'failed') setStatus('error')
 },
 onStateUpdate: (event) => {
 const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
 setLogs(prev => [...prev.slice(-100), `[${timestamp}] [SYSTEM] State changed to ${event.status}`])
 },
 onRunComplete: () => {
 const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
 setLogs(prev => [...prev.slice(-100), `[${timestamp}] [SYSTEM] Agent task completed successfully.`])
 setStatus('idle')
 streamClient.disconnect()
 setClient(null)
 setActiveRunId(null)
 toast.success('Agent Execution Completed!')
 },
 onError: (error) => {
 const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
 setLogs(prev => [...prev.slice(-100), `[${timestamp}] [SYSTEM ERR] ${error.error}`])
 setStatus('error')
 streamClient.disconnect()
 setClient(null)
 }
 })

 return () => {
 streamClient.disconnect()
 }
 }, [activeRunId])

 const startCycle = async () => {
 if (activeRunId) {
 toast.error('Agent is already running.')
 return
 }
 
 setLogs([
 `[SYSTEM] Initializing ${agent.name} core protocols...`,
 `[SYSTEM] Establishing secure neural link to ${agentId}-node...`,
 `[SYSTEM] Requesting standalone execution...`
 ])
 setStatus('active')

 try {
 const res = await api.post('/v2/runs/standalone', {
 stage: agentId,
 initial_input: { query: 'Testing agent connection from console' }
 })
 setActiveRunId(res.data.run_id)
 toast.success('Agent started successfully.')
 } catch (err: any) {
 toast.error(err.response?.data?.detail || 'Failed to start agent')
 setStatus('error')
 }
 }

 const forceStop = async () => {
 if (!activeRunId) {
 toast.error('No active run to stop.')
 return
 }
 try {
 await api.post(`/v2/runs/${activeRunId}/cancel`)
 if (client) {
 client.disconnect()
 setClient(null)
 }
 setActiveRunId(null)
 setStatus('idle')
 const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
 setLogs(prev => [...prev, `[${timestamp}] [SYSTEM] Force stop command acknowledged. Terminating...`])
 toast.success('Agent stopped.')
 } catch (err: any) {
 toast.error('Failed to stop agent.')
 }
 }

 return (
 <div className="max-w-[1600px] mx-auto space-y-10 pb-20">
 {/* Header */}
 <header className="flex items-center justify-between">
 <div className="flex items-center gap-6">
 <button 
 onClick={() => navigate('/dashboard/agents')}
 className="w-12 h-12 rounded-2xl bg-landing-surface border border-landing-divider flex items-center justify-center text-landing-muted hover:text-landing-primary transition-all group"
 >
 <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
 </button>
 <div className="space-y-1">
 <div className="flex items-center gap-3">
 <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", `bg-accent-${agent.color}/10 border-accent-${agent.color}/20 text-accent-${agent.color}`)}>
 <agent.icon size={20} />
 </div>
 <h1 className="text-3xl font-black text-landing-primary tracking-tight">{agent.name} <span className="text-landing-muted">Console</span></h1>
 </div>
 <p className="text-sm text-landing-muted font-medium ml-13">{agent.role}</p>
 </div>
 </div>

 <div className="flex items-center gap-4">
 <div className="px-4 py-2 rounded-xl bg-landing-surface border border-landing-divider flex items-center gap-3">
 <div className={cn("w-2 h-2 rounded-full", status === 'active' ? 'bg-accent-emerald animate-pulse' : 'bg-landing-elevated')} />
 <span className="text-[10px] font-black text-landing-primary tracking-tight">{status}</span>
 </div>
 <button className="h-12 px-6 rounded-xl bg-landing-surface border border-landing-divider text-xs font-black text-landing-primary hover:bg-landing-surface transition-all flex items-center gap-2">
 <Settings size={16} />
 Configure
 </button>
 </div>
 </header>

 <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
 {/* Main Terminal View */}
 <div className="xl:col-span-3 space-y-8">
 <div className="glass-panel border-landing-divider overflow-hidden flex flex-col h-[650px]">
 {/* Terminal Top Bar */}
 <div className="p-4 bg-landing-surface border-b border-landing-divider flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="flex gap-1.5">
 <div className="w-2.5 h-2.5 rounded-full bg-accent-rose/40" />
 <div className="w-2.5 h-2.5 rounded-full bg-accent-amber/40" />
 <div className="w-2.5 h-2.5 rounded-full bg-accent-emerald/40" />
 </div>
 <span className="text-[10px] font-mono text-landing-muted tracking-tight flex items-center gap-2">
 <TerminalIcon size={12} />
 ssh://xtarz-os/agents/{agentId}
 </span>
 </div>
 <div className="flex items-center gap-4">
 <span className="text-[10px] font-mono text-landing-muted">LATENCY: 1.2ms</span>
 <span className="text-[10px] font-mono text-landing-muted">ENCRYPTION: AES-256</span>
 </div>
 </div>

 {/* Terminal Logs */}
 <div 
 ref={scrollRef}
 className="flex-1 p-8 overflow-y-auto font-mono text-sm space-y-2 custom-scrollbar bg-landing-bg"
 >
 <AnimatePresence mode="popLayout">
 {logs.map((log, i) => (
 <motion.div 
 key={i}
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 className={cn(
"flex gap-4",
 log.includes('[SYSTEM]') ? 'text-landing-accent' : 'text-landing-secondary'
 )}
 >
 <span className="opacity-20 shrink-0">{(i + 1).toString().padStart(3, '0')}</span>
 <p className="leading-relaxed whitespace-pre-wrap">{log}</p>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>

 {/* Terminal Input Area */}
 <div className="p-6 bg-landing-surface border-t border-landing-divider">
 <div className="relative group">
 <div className="absolute inset-y-0 left-5 flex items-center text-landing-accent">
 <ChevronRight size={18} />
 </div>
 <input 
 className="w-full h-14 bg-landing-surface border border-landing-divider rounded-2xl pl-12 pr-6 text-sm font-mono text-white focus:outline-none focus:border-landing-accent/50 transition-all placeholder:text-landing-muted"
 placeholder="Enter agent command or override prompt..."
 />
 <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
 <div className="px-2 py-1 rounded bg-landing-surface border border-landing-divider text-[9px] font-black text-landing-muted">CMD + K</div>
 </div>
 </div>
 </div>
 </div>

 {/* Quick Actions */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 <button 
 onClick={startCycle}
 disabled={!!activeRunId}
 className="h-16 rounded-2xl bg-landing-surface border border-landing-divider hover:border-landing-accent transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
 >
 <Play size={18} className="text-accent-emerald group-hover:scale-110 transition-transform" />
 <span className="text-xs font-black text-landing-primary tracking-tight">Start Cycle</span>
 </button>
 <button 
 onClick={forceStop}
 disabled={!activeRunId}
 className="h-16 rounded-2xl bg-landing-surface border border-landing-divider hover:border-accent-rose transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
 >
 <Square size={18} className="text-accent-rose group-hover:scale-110 transition-transform" />
 <span className="text-xs font-black text-landing-primary tracking-tight">Force Stop</span>
 </button>
 <button 
 onClick={() => setLogs([`[SYSTEM] Local cache flushed. Ready.`])}
 className="h-16 rounded-2xl bg-landing-surface border border-landing-divider hover:border-landing-divider transition-all flex items-center justify-center gap-3 group"
 >
 <RefreshCcw size={18} className="text-accent-amber group-hover:scale-110 transition-transform" />
 <span className="text-xs font-black text-landing-primary tracking-tight">Clear Logs</span>
 </button>
 <button 
 className="h-16 rounded-2xl bg-landing-surface border border-landing-divider hover:border-landing-divider transition-all flex items-center justify-center gap-3 group"
 >
 <Database size={18} className="text-accent-cyan group-hover:scale-110 transition-transform" />
 <span className="text-xs font-black text-landing-primary tracking-tight">Flush Cache</span>
 </button>
 </div>
 </div>

 {/* Sidebar Stats & Info */}
 <div className="space-y-8">
 {/* Health Panel */}
 <div className="glass-panel p-8 space-y-8">
 <h3 className="text-[10px] font-black text-landing-muted tracking-tight">Agent Diagnostics</h3>
 
 <div className="space-y-6">
 {[
 { label: 'CPU Usage', value: '12.4%', sub: '4 Nodes Active', icon: Cpu },
 { label: 'RAM Usage', value: '2.8 GB', sub: 'Optimized', icon: Zap },
 { label: 'Sync Status', value: '100%', sub: 'Real-time', icon: RefreshCcw },
 { label: 'Security', value: 'LOCKED', sub: 'Shield Active', icon: Lock }
 ].map((stat) => (
 <div key={stat.label} className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-landing-surface border border-landing-divider flex items-center justify-center text-landing-secondary">
 <stat.icon size={18} />
 </div>
 <div className="flex-1">
 <div className="flex items-center justify-between mb-1">
 <p className="text-xs font-bold text-landing-muted">{stat.label}</p>
 <p className="text-sm font-black text-landing-primary">{stat.value}</p>
 </div>
 <p className="text-[10px] font-medium text-landing-muted tracking-tight">{stat.sub}</p>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Context Panel */}
 <div className="glass-panel p-8 bg-gradient-to-br from-accent-primary/5 to-transparent border-landing-accent/20 space-y-6">
 <div className="flex items-center gap-3">
 <Activity size={18} className="text-landing-accent" />
 <h3 className="text-[10px] font-black text-landing-primary tracking-tight">Current Context</h3>
 </div>
 <div className="space-y-4">
 <div className="p-4 rounded-xl bg-landing-surface border border-landing-divider space-y-2">
 <p className="text-[10px] font-black text-landing-muted tracking-tight">Target Niche</p>
 <p className="text-sm font-bold text-landing-primary">Pet Products / Smart Tech</p>
 </div>
 <div className="p-4 rounded-xl bg-landing-surface border border-landing-divider space-y-2">
 <p className="text-[10px] font-black text-landing-muted tracking-tight">Confidence Score</p>
 <p className="text-sm font-bold text-accent-emerald">94.2%</p>
 </div>
 </div>
 </div>

 {/* Network Panel */}
 <div className="glass-panel p-8 space-y-6">
 <div className="flex items-center gap-3">
 <Globe size={18} className="text-landing-muted" />
 <h3 className="text-[10px] font-black text-landing-primary tracking-tight">Network Nodes</h3>
 </div>
 <div className="space-y-3">
 {[
 { node: 'US-EAST', ping: '12ms', status: 'optimal' },
 { node: 'EU-WEST', ping: '48ms', status: 'optimal' },
 { node: 'ASIA-SOUTH', ping: '124ms', status: 'degraded' }
 ].map((n) => (
 <div key={n.node} className="flex items-center justify-between text-[11px] font-mono">
 <span className="text-landing-muted">{n.node}</span>
 <div className="flex items-center gap-3">
 <span className="text-landing-muted">{n.ping}</span>
 <div className={cn("w-1.5 h-1.5 rounded-full", n.status === 'optimal' ? 'bg-accent-emerald' : 'bg-accent-amber')} />
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 )
}
