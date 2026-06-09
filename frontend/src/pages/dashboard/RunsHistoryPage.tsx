import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
 History, 
 Search, 
 Filter, 
 ChevronRight, 
 ChevronDown, 
 Zap, 
 Calendar, 
 BarChart2, 
 Globe, 
 TrendingUp, 
 Clock, 
 ExternalLink,
 MoreHorizontal,
 LayoutGrid,
 List,
 Sparkles,
 Target,
 Loader2,
 Inbox
} from 'lucide-react'
import { cn } from '../../lib/utils'
import api from '../../lib/api'

export default function RunsHistoryPage() {
 const navigate = useNavigate()
 const [view, setView] = useState<'grid' | 'list'>('grid')
 const [runs, setRuns] = useState<any[]>([])
 const [isLoading, setIsLoading] = useState(true)

 useEffect(() => {
 async function fetchRuns() {
 try {
 const response = await api.get('/v2/runs/')
 const mappedRuns = response.data.map((run: any) => {
 const engineData = run.engine_data || {}
 const initialInput = engineData.initial_input || {}
 
 // Niche name is either custom name or target query
 const niche = run.name || initialInput.query || 'Unnamed Campaign'
 
 // Format date
 const date = new Date(run.created_at).toLocaleDateString('en-US', {
 month: 'short',
 day: 'numeric',
 year: 'numeric'
 })
 
 const AGENT_LABELS: Record<string, string> = {
 product_intelligence: 'Product Discovery',
 competitor_intelligence: 'Competitor Intel',
 product_sourcing: 'Sourcing',
 commerce_creation: 'Store Builder',
 meta_ads_spy: 'Ad Creative',
 }
 const agentLabel = AGENT_LABELS[run.agent || run.current_stage] || 'Agent Run'
 
 // Get margin
 let margin = 'TBD'
 const sourcingMargin = engineData.product_sourcing?.profit_margin_estimate
 const piMargin = engineData.product_intelligence?.estimated_margin
 if (sourcingMargin !== undefined && sourcingMargin !== null) {
 margin = `${sourcingMargin.toFixed(1)}%`
 } else if (piMargin !== undefined && piMargin !== null) {
 margin = `${piMargin.toFixed(1)}%`
 }
 
 // Get intelligence score
 const score = engineData.product_intelligence?.trend_score || 90
 
 // Status mapping
 let status = 'Running'
 let color = 'cyan'
 
 if (run.status === 'completed') {
 status = 'Success'
 color = 'emerald'
 } else if (run.status === 'failed') {
 status = 'Failed'
 color = 'rose'
 } else if (run.status === 'paused') {
 status = 'Awaiting Review'
 color = 'amber'
 } else if (run.status === 'stopped') {
 status = 'Stopped'
 color = 'indigo'
 }
 
 return {
 id: String(run.id),
 niche,
 date,
 agent: agentLabel,
 margin,
 score,
 status,
 color
 }
 })
 setRuns(mappedRuns)
 } catch (err) {
 console.error('Failed to fetch runs:', err)
 } finally {
 setIsLoading(false)
 }
 }
 fetchRuns()
 }, [])

 return (
 <div className="max-w-[1600px] mx-auto space-y-12 pb-32">
 {/* Header */}
 <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-2xl bg-landing-surface border border-landing-divider flex items-center justify-center text-landing-secondary">
 <History size={24} />
 </div>
 <h1 className="text-4xl font-black text-landing-primary tracking-tight">Intelligence Archive</h1>
 </div>
 <p className="text-lg text-landing-secondary font-medium leading-relaxed max-w-2xl">
 Chronological record of all agent runs across Product Discovery, Intel, Sourcing, and Store Builder.
 </p>
 </div>
 
 <div className="flex items-center gap-4">
 <div className="flex p-1 bg-landing-surface border border-landing-divider rounded-xl">
 <button 
 onClick={() => setView('grid')}
 className={cn("p-2 rounded-lg transition-all", view === 'grid' ?"bg-landing-surface text-white" :"text-landing-muted hover:text-landing-secondary")}
 >
 <LayoutGrid size={18} />
 </button>
 <button 
 onClick={() => setView('list')}
 className={cn("p-2 rounded-lg transition-all", view === 'list' ?"bg-landing-surface text-white" :"text-landing-muted hover:text-landing-secondary")}
 >
 <List size={18} />
 </button>
 </div>
 <button className="flex items-center gap-3 px-6 h-14 bg-landing-surface border border-landing-divider rounded-2xl hover:border-landing-divider transition-all text-sm font-black text-landing-primary">
 <Filter size={18} className="text-landing-muted" />
 Filter Archive
 </button>
 </div>
 </header>

 {/* Loading & Content View */}
 {isLoading ? (
 <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
 <Loader2 size={36} className="text-landing-accent animate-spin" />
 <p className="text-sm font-bold text-landing-secondary tracking-tight">Decrypting archive records...</p>
 </div>
 ) : runs.length === 0 ? (
 <div className="glass-panel p-16 flex flex-col items-center justify-center text-center space-y-6 max-w-3xl mx-auto border-landing-divider">
 <div className="w-16 h-16 rounded-3xl bg-landing-surface border border-landing-divider flex items-center justify-center text-landing-muted">
 <Inbox size={32} />
 </div>
 <div className="space-y-2">
 <h3 className="text-xl font-black text-landing-primary tracking-tight">Archive Empty</h3>
 <p className="text-sm text-landing-secondary leading-relaxed max-w-md">
 No agent runs yet. Start with Product Discovery to research a niche or product idea.
 </p>
 </div>
 <button 
 onClick={() => navigate('/dashboard/products')}
 className="cta-button h-12 px-8 rounded-xl font-bold text-sm"
 >
 Start Product Discovery
 </button>
 </div>
 ) : (
 <AnimatePresence mode="wait">
 {view === 'grid' ? (
 <motion.div 
 key="grid"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
 >
 {runs.map((run, i) => (
 <motion.div 
 key={run.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05 }}
 onClick={() => navigate(`/dashboard/workflow?run_id=${run.id}`)}
 className="glass-panel p-8 space-y-8 cursor-pointer group hover:border-landing-divider"
 >
 <div className="flex justify-between items-start">
 <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border", `bg-accent-${run.color}/10 border-accent-${run.color}/20 text-accent-${run.color}`)}>
 <Zap size={28} />
 </div>
 <div className="text-right">
 <p className="text-[10px] font-black text-landing-muted tracking-tight">Temporal ID</p>
 <p className="text-sm font-black text-landing-primary">#{run.id.slice(0, 8)}</p>
 </div>
 </div>

 <div className="space-y-2">
 <h3 className="text-2xl font-black text-landing-primary tracking-tight group-hover:text-landing-accent transition-colors line-clamp-1">{run.niche}</h3>
 <div className="flex items-center gap-3">
 <Calendar size={14} className="text-landing-muted" />
 <span className="text-xs font-black text-landing-muted tracking-tight">{run.date}</span>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-8 pt-4 border-t border-landing-divider">
 <div>
 <p className="text-[10px] font-black text-landing-muted tracking-tight mb-1">Agent</p>
 <p className="text-sm font-black text-landing-primary">{run.agent}</p>
 </div>
 <div>
 <p className="text-[10px] font-black text-landing-muted tracking-tight mb-1">Intelligence Score</p>
 <p className="text-xl font-black text-accent-emerald tabular-nums">{run.score}%</p>
 </div>
 </div>

 <div className="pt-6 flex items-center justify-between">
 <div className={cn(
"flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black tracking-tight border",
 run.status === 'Success' ?"bg-accent-emerald/5 border-accent-emerald/20 text-accent-emerald" : 
 run.status === 'Failed' ?"bg-accent-rose/5 border-accent-rose/20 text-accent-rose" :"bg-accent-amber/5 border-accent-amber/20 text-accent-amber"
 )}>
 <div className={cn("w-1.5 h-1.5 rounded-full", 
 run.status === 'Success' ?"bg-accent-emerald" : 
 run.status === 'Failed' ?"bg-accent-rose" :"bg-accent-amber"
 )} />
 {run.status}
 </div>
 <button className="text-xs font-black text-landing-muted group-hover:text-landing-primary transition-all flex items-center gap-2">
 Review Scan <ChevronRight size={14} />
 </button>
 </div>
 </motion.div>
 ))}
 </motion.div>
 ) : (
 <motion.div 
 key="list"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="glass-panel overflow-hidden border-landing-divider"
 >
 <table className="w-full">
 <thead>
 <tr className="text-[11px] font-black text-landing-muted tracking-tight text-left border-b border-landing-divider">
 <th className="p-8 pl-10">Operation Identity</th>
 <th className="p-8">Temporal Reference</th>
 <th className="p-8">Agent</th>
 <th className="p-8">Intelligence Score</th>
 <th className="p-8 text-right pr-10">Protocol</th>
 </tr>
 </thead>
 <tbody className="text-sm">
 {runs.map((run, i) => (
 <tr 
 key={run.id} 
 onClick={() => navigate(`/dashboard/workflow?run_id=${run.id}`)}
 className="border-b border-landing-divider last:border-0 hover:bg-landing-surface transition-colors group cursor-pointer"
 >
 <td className="p-8 pl-10">
 <div className="flex items-center gap-6">
 <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border transition-all group-hover:scale-110", `bg-accent-${run.color}/10 border-accent-${run.color}/20 text-accent-${run.color}`)}>
 <Zap size={22} />
 </div>
 <div>
 <span className="font-black text-landing-primary block tracking-tight text-base line-clamp-1">{run.niche}</span>
 <span className="text-[10px] font-black text-landing-muted tracking-tight mt-0.5">Primary Operation</span>
 </div>
 </div>
 </td>
 <td className="p-8">
 <div className="flex flex-col gap-1">
 <span className="text-landing-primary font-black">{run.date}</span>
 <span className="text-[10px] text-landing-muted font-mono">NODE_#{run.id.slice(0, 8)}</span>
 </div>
 </td>
 <td className="p-8">
 <span className="text-sm font-black text-landing-primary">{run.agent}</span>
 </td>
 <td className="p-8">
 <div className="flex items-center gap-4">
 <div className="flex-1 h-2 w-24 bg-landing-surface rounded-full overflow-hidden border border-landing-divider">
 <div className={cn("h-full rounded-full", `bg-accent-${run.color}`)} style={{ width: `${run.score}%` }} />
 </div>
 <span className="text-sm font-black text-landing-primary tabular-nums">{run.score}%</span>
 </div>
 </td>
 <td className="p-8 text-right pr-10">
 <button className="w-10 h-10 rounded-xl bg-landing-surface border border-landing-divider flex items-center justify-center text-landing-muted hover:text-landing-primary transition-all ml-auto">
 <ChevronRight size={18} />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </motion.div>
 )}
 </AnimatePresence>
 )}

 {/* Stats Counter */}
 {!isLoading && runs.length > 0 && (
 <div className="flex flex-col items-center gap-6 pt-12">
 <p className="text-[11px] font-black text-landing-muted tracking-tight">
 Monitoring {runs.length} Historical {runs.length === 1 ? 'Node' : 'Nodes'}
 </p>
 </div>
 )}
 </div>
 )
}

