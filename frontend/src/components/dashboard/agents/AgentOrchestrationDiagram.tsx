import { motion } from 'framer-motion'
import { Search, Target, TrendingUp, BarChart2, Package, Zap, LucideIcon } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface NodeProps {
 id: string
 name: string
 icon: LucideIcon
 color: string
 status: 'pending' | 'running' | 'done'
 x: number
 y: number
}

const AGENTS = [
 { id: 'product_intel', name: 'Product Intel', icon: Search, color: '#06b6d4' },
 { id: 'competitor_intel', name: 'Competitor Intel', icon: Target, color: '#f43f5e' },
 { id: 'commerce_creation', name: 'Creation', icon: TrendingUp, color: '#10b981' },
 { id: 'deployment', name: 'Deployment', icon: Zap, color: '#3b82f6' },
 { id: 'performance', name: 'Performance', icon: BarChart2, color: '#f59e0b' }
]

export default function AgentOrchestrationDiagram() {
 return (
 <div className="w-full bg-landing-surface border border-landing-divider rounded-2xl p-8 relative overflow-hidden">
 {/* Background Grid */}
 <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} 
 />

 {/* SVG Lines Connector */}
 <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
 <defs>
 <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
 <stop offset="0%" stopColor="#ffffff00" />
 <stop offset="50%" stopColor="#ffffff40" />
 <stop offset="100%" stopColor="#ffffff00" />
 </linearGradient>
 </defs>
 
 {/* Linear Sequential Flow */}
 <FlowLine x1={150} y1={130} x2={280} y2={130} active={true} />
 <FlowLine x1={430} y1={130} x2={560} y2={130} active={true} />
 <FlowLine x1={710} y1={130} x2={840} y2={130} active={false} />
 </svg>

 {/* Nodes Container */}
 <div className="relative z-10 flex flex-wrap justify-center items-center gap-8 max-w-6xl mx-auto py-10">
 
 <AgentNode name="Product Intel" icon={Search} color="#06b6d4" status="done" />
 <AgentNode name="Competitor" icon={Target} color="#f43f5e" status="done" />
 <AgentNode name="Creation" icon={TrendingUp} color="#10b981" status="running" />
 <AgentNode name="Deployment" icon={Zap} color="#3b82f6" status="pending" />
 <AgentNode name="Performance" icon={BarChart2} color="#f59e0b" status="pending" />

 </div>

 {/* Mobile View Indicator */}
 <div className="md:hidden mt-8 space-y-4">
 <p className="text-[10px] text-center font-bold text-landing-muted tracking-tight">Orchestration flow simplified for mobile</p>
 </div>
 </div>
 )
}

function FlowLine({ x1, y1, x2, y2, active }: { x1: number, y1: number, x2: number, y2: number, active: boolean }) {
 return (
 <>
 <line 
 x1={x1} y1={y1} x2={x2} y2={y2} 
 stroke="#ffffff08" strokeWidth="1" 
 />
 {active && (
 <motion.line 
 x1={x1} y1={y1} x2={x2} y2={y2} 
 stroke="url(#flowGradient)" strokeWidth="2" 
 strokeDasharray="40, 100"
 animate={{ strokeDashoffset: [-140, 0] }}
 transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
 />
 )}
 </>
 )
}

function AgentNode({ name, icon: Icon, color, status, className, compact }: any) {
 const statusColors = {
 pending: 'border-landing-divider opacity-40',
 running: 'border-accent-cyan ring-4 ring-accent-cyan/10',
 done: 'border-accent-emerald ring-1 ring-accent-emerald/20'
 }

 return (
 <motion.div 
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className={cn(
"flex items-center gap-3 bg-landing-bg border rounded-lg px-4 py-2 group transition-all duration-500",
 statusColors[status as keyof typeof statusColors],
 compact ?"w-40" :"w-48 py-3",
 className
 )}
 >
 <div 
 className="w-8 h-8 rounded-md flex items-center justify-center border border-landing-divider"
 style={{ backgroundColor: `${color}10`, color }}
 >
 <Icon size={16} />
 </div>
 <div className="flex-1">
 <p className="text-[11px] font-bold text-white tracking-widest uppercase">{name}</p>
 {status === 'running' && (
 <div className="mt-1 h-[1px] bg-accent-cyan w-full overflow-hidden">
 <motion.div 
 animate={{ x: [-20, 40] }}
 transition={{ repeat: Infinity, duration: 1 }}
 className="h-full w-4 bg-white/40"
 />
 </div>
 )}
 </div>
 {status === 'done' && (
 <motion.div 
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 className="text-accent-emerald"
 >
 <Zap size={12} fill="currentColor" />
 </motion.div>
 )}
 </motion.div>
 )
}
