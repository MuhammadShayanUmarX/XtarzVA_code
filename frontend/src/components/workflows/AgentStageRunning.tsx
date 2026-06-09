import { motion } from 'framer-motion'
import { RefObject } from 'react'
import { cn } from '../../lib/utils'
import { AgentStep } from '../../types/workflow'

interface AgentStageRunningProps {
 agent: AgentStep
 progress: number
 logs: string[]
 scrollRef: RefObject<HTMLDivElement>
}

export default function AgentStageRunning({ agent, progress, logs, scrollRef }: AgentStageRunningProps) {
 return (
 <motion.div 
 key="running"
 initial={{ opacity: 0, scale: 0.98 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 1.02 }}
 className="space-y-8"
 >
 <div className="glass-panel p-10 space-y-12 bg-white/[0.01] relative overflow-hidden">
 <div className="absolute top-0 right-0 p-10 opacity-5">
 <agent.icon size={200} className={`text-accent-${agent.color}`} />
 </div>
 
 <div className="space-y-8 relative z-10">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-full border-4 border-landing-divider border-t-accent-primary animate-spin" />
 <span className="text-sm font-black text-white tracking-tight">
 {progress < 20 ? 'Connecting research APIs...' : progress < 60 ? 'Scanning TikTok, Reddit, Amazon & web...' : 'Analyzing with AI...'}
 </span>
 </div>
 <span className="text-2xl font-black text-white tabular-nums">{progress}%</span>
 </div>
 
 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
 <motion.div 
 className={cn("h-full", `bg-accent-${agent.color}`)}
 style={{ width: `${progress}%` }}
 />
 </div>
 </div>

 <div className="rounded-2xl bg-black/40 border border-landing-divider p-6 font-mono text-xs space-y-2 h-48 overflow-y-auto custom-scrollbar relative z-10" ref={scrollRef}>
 {logs.map((log, i) => (
 <div key={i} className={cn("flex gap-4", log.includes('[SYSTEM]') ? 'text-landing-accent' : 'text-landing-muted')}>
 <span className="opacity-30">{i+1}</span>
 <p>{log}</p>
 </div>
 ))}
 </div>
 </div>
 </motion.div>
 )
}
