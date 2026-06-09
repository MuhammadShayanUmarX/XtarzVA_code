import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown, LucideIcon } from 'lucide-react'
import { cn } from '../../../lib/utils'

export interface LogLine {
 id: string
 agent: string
 color: string
 m: string
 t: string
 type?: 'product' | 'error' | 'success' | 'metric'
}

interface AgentConsoleFeedProps {
 logs: LogLine[]
 runId: string
 isStreaming: boolean
}

const AGENT_COLORS: Record<string, string> = {
 'PRODUCT_INTEL': 'text-accent-cyan',
 'COMPETITOR_INTEL': 'text-accent-rose',
 'COMMERCE_CREATION': 'text-accent-emerald',
 'DEPLOYMENT': 'text-landing-accent',
 'PERFORMANCE': 'text-accent-amber',
 'SYSTEM': 'text-white'
}

export default function AgentConsoleFeed({ logs, runId, isStreaming }: AgentConsoleFeedProps) {
 const [autoScroll, setAutoScroll] = useState(true)
 const [showScrollBottom, setShowScrollBottom] = useState(false)
 const terminalRef = useRef<HTMLDivElement>(null)

 useEffect(() => {
 if (autoScroll && terminalRef.current) {
 terminalRef.current.scrollTop = terminalRef.current.scrollHeight
 }
 }, [logs, autoScroll])

 const handleScroll = () => {
 if (!terminalRef.current) return
 const { scrollTop, scrollHeight, clientHeight } = terminalRef.current
 const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
 setAutoScroll(isAtBottom)
 setShowScrollBottom(!isAtBottom && logs.length > 0)
 }

 const scrollToBottom = () => {
 setAutoScroll(true)
 if (terminalRef.current) {
 terminalRef.current.scrollTop = terminalRef.current.scrollHeight
 }
 }

 return (
 <div className="flex flex-col h-full bg-black border border-landing-divider rounded-xl overflow-hidden shadow-2xl">
 {/* Header Bar */}
 <header className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-landing-divider relative">
 <div className="flex gap-1.5 shrink-0">
 <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
 <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
 </div>
 
 <div className="absolute left-1/2 -translate-x-1/2 text-[11px] font-bold text-landing-muted tracking-tight font-mono">
 Agent Console — Run #{runId}
 </div>

 <div className="flex items-center gap-2">
 {isStreaming && (
 <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 animate-in fade-in">
 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
 <span className="text-[10px] font-bold tracking-tight">Live</span>
 </div>
 )}
 </div>
 </header>

 {/* Terminal Content */}
 <div 
 ref={terminalRef}
 onScroll={handleScroll}
 className="flex-1 p-5 font-mono text-[12.5px] leading-[1.8] overflow-y-auto custom-scrollbar bg-[rgba(10,15,30,0.5)]"
 >
 <AnimatePresence initial={false}>
 {logs.map((log) => (
 <motion.div 
 key={log.id}
 initial={{ opacity: 0, y: 4 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.2 }}
 className="flex gap-4 group"
 >
 <span className="text-landing-muted shrink-0 select-none">[{log.t}]</span>
 <span className={cn("font-bold uppercase tracking-tighter shrink-0 w-[100px]", AGENT_COLORS[log.agent] || 'text-landing-secondary')}>
 [{log.agent}]
 </span>
 <span className={cn(
"text-landing-secondary transition-colors group-hover:text-white",
 log.type === 'product' &&"text-white font-bold",
 log.type === 'error' &&"text-rose-400 italic",
 log.type === 'success' &&"text-emerald-400 font-bold",
 log.type === 'metric' &&"text-accent-amber font-mono"
 )}>
 {log.type === 'error' && '⚠ '}
 {log.type === 'success' && '✓ '}
 {log.m}
 </span>
 </motion.div>
 ))}
 </AnimatePresence>
 
 {isStreaming && (
 <div className="flex gap-4 mt-2 h-5">
 <span className="text-landing-muted select-none">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
 <div className="w-2 h-4 bg-white/20 animate-pulse self-center" />
 </div>
 )}
 </div>

 {/* Scroll Bottom Overlay */}
 <AnimatePresence>
 {showScrollBottom && (
 <motion.button 
 initial={{ y: 20, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 exit={{ y: 20, opacity: 0 }}
 onClick={scrollToBottom}
 className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-landing-accent text-white text-[11px] font-bold rounded-full flex items-center gap-2 hover:scale-105 active:scale-95 transition-all z-20"
 >
 <ArrowDown size={14} /> ↓ New logs
 </motion.button>
 )}
 </AnimatePresence>
 </div>
 )
}
