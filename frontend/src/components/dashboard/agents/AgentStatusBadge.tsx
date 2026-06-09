import { motion } from 'framer-motion'
import { cn } from '../../../lib/utils'

export type BadgeState = 'idle' | 'queued' | 'running' | 'done' | 'error'

interface AgentStatusBadgeProps {
 state: BadgeState
 size?: 'sm' | 'md'
}

export default function AgentStatusBadge({ state, size = 'md' }: AgentStatusBadgeProps) {
 const dotSize = size === 'sm' ? 'w-1 h-1' : 'w-2 h-2'

 const variants = {
 idle:"bg-landing-elevated",
 queued:"bg-amber-500",
 running:"bg-accent-cyan",
 done:"bg-accent-emerald",
 error:"bg-accent-rose"
 }

 return (
 <div className="relative flex items-center justify-center">
 {state === 'running' && (
 <motion.div 
 initial={{ scale: 1, opacity: 0.5 }}
 animate={{ scale: 2.5, opacity: 0 }}
 transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }}
 className={cn("absolute rounded-full", dotSize, variants[state])}
 />
 )}
 
 <motion.div 
 initial={state === 'error' ? { x: -2 } : false}
 animate={state === 'error' ? { x: [2, -2, 2, -2, 0] } : false}
 transition={{ duration: 0.4 }}
 className={cn(
"rounded-full relative z-10", 
 dotSize, 
 variants[state],
 state === 'queued' &&"animate-pulse"
 )}
 />

 {state === 'running' && (
 <div className={cn("absolute rounded-full border border-accent-cyan/30 w-4 h-4 animate-ping")} />
 )}
 </div>
 )
}
