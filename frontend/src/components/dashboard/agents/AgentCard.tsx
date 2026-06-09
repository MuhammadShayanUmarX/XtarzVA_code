import { motion } from 'framer-motion'
import { CheckCircle2, Zap, Layout, Search, Target, TrendingUp, BarChart2, Package, Activity, Cpu } from 'lucide-react'
import { cn } from '../../../lib/utils'

export type AgentState = 'idle' | 'queued' | 'running' | 'done' | 'error' | 'skipped'

interface AgentCardProps {
 name: string
 mission: string
 icon: any
 state: AgentState
 color?: string
 subTask?: string
 elapsedTime?: string
}

const MISSION_COPY: Record<string, string> = {
 'Product Intelligence': 'Monitoring TikTok trend acceleration & social signals.',
 'Competitor Intelligence': 'Mapping rival price distribution and inventory gaps.',
 'Commerce Creation': 'Synthesizing high-velocity keyword frameworks and visuals.',
 'Deployment Engine': 'Synchronizing intelligence with Shopify deployment nodes.',
 'Performance Monitor': 'Tracking live ROAS and conversion metrics.'
}

export default function AgentCard({ 
 name, 
 mission, 
 icon: Icon, 
 state = 'idle', 
 color = 'primary',
 subTask,
 elapsedTime
}: AgentCardProps) {
 
 const finalMission = MISSION_COPY[name] || mission
 const agentColor = color === 'primary' ? 'var(--accent-primary)' : `var(--accent-${color})`

 return (
 <motion.div 
 whileHover={{ y: -2 }}
 className={cn(
"relative p-5 rounded-3xl border transition-all duration-500 overflow-hidden group",
 state === 'running' 
 ?"bg-accent-cyan/[0.04] border-accent-cyan/20" 
 :"bg-white/[0.02] border-landing-divider"
 )}
 >
 {/* Background Glow */}
 <div 
 className={cn(
"absolute inset-0 opacity-0 transition-opacity duration-700 pointer-events-none",
 state === 'running' ?"opacity-20" :"group-hover:opacity-10"
 )}
 style={{ 
 background: `radial-gradient(circle at top left, ${agentColor}, transparent 70%)` 
 }}
 />

 {/* Scannline (for running state) */}
 {state === 'running' && <div className="scan-line opacity-20" />}

 <div className="relative z-10">
 <div className="flex items-center justify-between mb-4">
 <div 
 className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-transform duration-500 group-hover:scale-110" 
 style={{ 
 backgroundColor: `${agentColor}15`, 
 borderColor: `${agentColor}20`,
 color: agentColor
 }}
 >
 <Icon size={22} className={cn(state === 'running' &&"animate-pulse")} />
 </div>
 <div className="flex flex-col items-end">
 {state === 'running' ? (
 <div className="flex items-center gap-2">
 <Activity size={12} className="text-accent-cyan animate-pulse" />
 <span className="text-[10px] font-black text-accent-cyan tracking-tight">Active</span>
 </div>
 ) : (
 <span className="text-[10px] font-black text-landing-muted tracking-tight">{state}</span>
 )}
 </div>
 </div>

 <h4 className="text-base font-black text-white tracking-tight mb-1.5">{name}</h4>
 <p className="text-[12px] text-landing-secondary font-medium leading-relaxed mb-6">
 {finalMission}
 </p>
 </div>

 <div className="relative z-10 flex items-center justify-between mt-auto">
 <div className="flex-1 min-w-0">
 {state === 'running' && subTask && (
 <div className="flex items-center gap-2">
 <div className="flex gap-0.5">
 <div className="w-0.5 h-2 bg-accent-cyan/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
 <div className="w-0.5 h-3 bg-accent-cyan/60 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
 <div className="w-0.5 h-2.5 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
 </div>
 <p className="text-[11px] font-mono text-accent-cyan truncate">
 {subTask}
 </p>
 </div>
 )}
 {state === 'done' && (
 <div className="flex items-center gap-2">
 <CheckCircle2 size={14} className="text-accent-emerald" />
 <span className="text-[10px] font-black text-accent-emerald tracking-tight">Optimized</span>
 </div>
 )}
 </div>
 {state === 'done' && elapsedTime && (
 <span className="text-[9px] font-bold text-landing-muted uppercase tracking-tighter">
 {elapsedTime}
 </span>
 )}
 </div>

 {/* Progress Track (for running state) */}
 {state === 'running' && (
 <div className="absolute bottom-0 left-0 right-0 h-1 bg-landing-elevated">
 <motion.div 
 className="h-full bg-accent-cyan"
 initial={{ width: '0%' }}
 animate={{ width: '100%' }}
 transition={{ duration: 8, repeat: Infinity, ease:"linear" }}
 />
 </div>
 )}
 </motion.div>
 )
}
