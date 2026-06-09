import { motion } from 'framer-motion'
import { CheckCircle2, Lock } from 'lucide-react'
import { cn } from '../../lib/utils'
import { AgentStep } from '../../types/workflow'

interface WorkflowProgressBarProps {
 agents: AgentStep[]
 activeStep: number
}

export default function WorkflowProgressBar({ agents, activeStep }: WorkflowProgressBarProps) {
 return (
 <div className="glass-panel p-6 w-full">
 <div className="flex items-center justify-between gap-4">
 {agents.map((a, idx) => (
 <div key={a.id} className="flex-1 flex items-center gap-4 group relative">
 <div 
 title={a.locked ? `${a.name} (${a.lockedText || 'Coming Soon'})` : a.name}
 className={cn(
"w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 relative",
 a.locked ?"bg-white/[0.01] border-landing-divider text-landing-muted opacity-40 cursor-not-allowed" :
 idx < activeStep ?"bg-accent-emerald/20 border-accent-emerald text-accent-emerald" :
 idx === activeStep ? `bg-accent-${a.color}/20 border-accent-${a.color} text-accent-${a.color} animate-pulse` :
"bg-white/[0.03] border-landing-divider text-landing-muted"
 )}
 >
 {a.locked ? (
 <div className="relative flex items-center justify-center">
 <a.icon size={16} className="opacity-50" />
 <div className="absolute -top-1.5 -right-1.5 bg-landing-bg border border-landing-divider rounded-full p-0.5 text-accent-amber scale-75 flex items-center justify-center">
 <Lock size={8} />
 </div>
 </div>
 ) : idx < activeStep ? (
 <CheckCircle2 size={18} />
 ) : (
 <a.icon size={18} />
 )}
 </div>
 {idx < agents.length - 1 && (
 <div className="flex-1 h-px bg-white/5 relative">
 <motion.div 
 initial={{ width: '0%' }}
 animate={{ width: idx < activeStep && !agents[idx + 1].locked ? '100%' : '0%' }}
 className="absolute inset-0 bg-accent-emerald"
 />
 </div>
 )}
 </div>
 ))}
 </div>
 </div>
 )
}
