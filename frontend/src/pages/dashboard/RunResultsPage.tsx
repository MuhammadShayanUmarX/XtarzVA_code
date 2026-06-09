import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { 
 ChevronLeft, 
 Download, 
 ExternalLink, 
 Share2, 
 CheckCircle2, 
 TrendingUp, 
 BarChart2, 
 Search, 
 Package, 
 Zap, 
 FileText, 
 Target, 
 DollarSign, 
 ArrowRight,
 ChevronDown,
 ChevronUp,
 Globe,
 Tag,
 ShoppingBag,
 Info,
 Clock,
 ArrowLeft,
 ShieldCheck,
 Brain,
 Activity,
 Cpu,
 Sparkles,
 PieChart
} from 'lucide-react'
import * as Tabs from '@radix-ui/react-tabs'
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area } from 'recharts'
import { cn } from '../../lib/utils'
import { StaggerContainer, staggerItem } from '../../components/ui/LoadingStates'

const PRODUCTS = [
 { id: 1, name: 'Ergonomic Desk Footrest with Massage Roller', source: 'AliExpress', margin: 41.3, trend: 8.4, price: 29.99, cogs: 4.20, shipping: 3.80, image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?w=400&q=80', tags: ['🔥 Trending on TikTok', '👥 Low competition', '📦 Fast shipping'], confidence: 98 },
 { id: 2, name: 'Portable Mini Blender', source: 'Amazon', margin: 28.5, trend: 7.2, price: 34.50, cogs: 12.00, shipping: 5.50, image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80', tags: ['📸 High creative potential', '📉 Price gap found'], confidence: 92 },
 { id: 3, name: 'Smart Pet Feeder Pro', source: 'AliExpress', margin: 35.1, trend: 9.1, price: 89.00, cogs: 34.00, shipping: 12.00, image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80', tags: ['⭐ 4.8+ Rating', '🏢 Premium Niche'], confidence: 95 }
]

const PERFORMANCE_DATA = [
 { name: 'R1', discovery: 42, precision: 98 },
 { name: 'R2', discovery: 38, precision: 95 },
 { name: 'R3', discovery: 56, precision: 92 },
 { name: 'R4', discovery: 48, precision: 96 },
 { name: 'R5', discovery: 62, precision: 99 },
]

export default function RunResultsPage() {
 const navigate = useNavigate()
 const { runId } = useParams()
 const [activeTab, setActiveTab] = useState('intelligence')

 return (
 <div className="max-w-[1600px] mx-auto space-y-12 pb-32">
 {/* Back Header */}
 <nav className="flex items-center gap-4">
 <button 
 onClick={() => navigate('/dashboard/runs')}
 className="w-10 h-10 rounded-xl bg-landing-surface border border-landing-divider flex items-center justify-center text-landing-muted hover:text-landing-primary transition-all"
 >
 <ArrowLeft size={18} />
 </button>
 <div className="flex items-center gap-3">
 <span className="text-[10px] font-black text-landing-muted tracking-tight">Archive</span>
 <span className="text-landing-muted">/</span>
 <span className="text-[10px] font-black text-landing-primary tracking-tight">Mission Report #{runId || '48'}</span>
 </div>
 </nav>

 {/* Hero Mission Overview */}
 <header className="glass-panel p-12 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-primary/10 via-transparent to-transparent opacity-50" />
 <div className="absolute -top-24 -right-24 w-96 h-96 bg-landing-accent/5 blur-[120px] rounded-full" />
 
 <div className="relative z-10 flex flex-col xl:flex-row gap-12 items-center">
 <div className="flex-1 space-y-8 text-center xl:text-left">
 <div className="space-y-4">
 <div className="flex items-center justify-center xl:justify-start gap-4">
 <div className="px-3 py-1 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-[10px] font-black text-accent-emerald tracking-tight">
 Mission Successful
 </div>
 <div className="flex items-center gap-2">
 <Clock size={14} className="text-landing-muted" />
 <span className="text-[10px] font-bold text-landing-muted tracking-tight">June 9, 2025 • 2m 14s</span>
 </div>
 </div>
 <h1 className="text-4xl lg:text-5xl font-black text-landing-primary tracking-tight">Operation: Viral Home-Office Discovery</h1>
 <p className="text-lg text-landing-secondary max-w-2xl font-medium leading-relaxed">
 Autonomous sweep of the high-ticket pet wellness sector. Identified <span className="text-landing-primary">12 regional trend nodes</span> and validated <span className="text-landing-primary">3 high-confidence assets</span>.
 </p>
 </div>

 <div className="flex flex-wrap justify-center xl:justify-start gap-4">
 <button className="cta-button h-14 px-8 rounded-2xl">
 Launch All to Shopify
 </button>
 <button className="h-14 px-8 rounded-2xl bg-landing-surface border border-landing-divider text-landing-primary font-bold hover:bg-white/[0.06] transition-all flex items-center gap-3">
 <Download size={18} />
 Export Intelligence Pack
 </button>
 </div>
 </div>

 <div className="w-full xl:w-[400px] space-y-4">
 <div className="p-6 rounded-3xl bg-landing-surface border border-landing-divider space-y-6">
 <div className="flex items-center justify-between">
 <p className="text-[10px] font-black text-landing-muted tracking-tight">Mission Yield</p>
 <Zap size={14} className="text-landing-accent" />
 </div>
 <div className="grid grid-cols-2 gap-8">
 <div>
 <p className="text-3xl font-black text-landing-primary tabular-nums">12</p>
 <p className="text-[10px] font-black text-landing-muted tracking-tight">Signals</p>
 </div>
 <div>
 <p className="text-3xl font-black text-accent-emerald tabular-nums">94%</p>
 <p className="text-[10px] font-black text-landing-muted tracking-tight">Confidence</p>
 </div>
 </div>
 <div className="h-2 w-full bg-landing-surface rounded-full overflow-hidden">
 <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} transition={{ duration: 1.5 }} className="h-full bg-accent-emerald rounded-full" />
 </div>
 </div>
 </div>
 </div>
 </header>

 {/* Intelligence Tabs */}
 <Tabs.Root defaultValue="intelligence" onValueChange={setActiveTab} className="space-y-10">
 <Tabs.List className="flex p-1.5 bg-landing-surface border border-landing-divider rounded-2xl w-fit">
 {[
 { id: 'intelligence', label: 'Intelligence Assets', icon: Search },
 { id: 'financials', label: 'Profit Modeling', icon: BarChart2 },
 { id: 'reasoning', label: 'Agent Reasoning', icon: Brain },
 { id: 'deployment', label: 'Deployment Options', icon: Globe }
 ].map(tab => (
 <Tabs.Trigger 
 key={tab.id} 
 value={tab.id} 
 className="flex items-center gap-3 px-8 py-3 rounded-xl text-sm font-black text-landing-muted data-[state=active]:bg-landing-surface data-[state=active]:text-white transition-all outline-none tracking-tight"
 >
 <tab.icon size={16} />
 {tab.label}
 </Tabs.Trigger>
 ))}
 </Tabs.List>

 {/* Intelligence Assets Tab */}
 <Tabs.Content value="intelligence" className="space-y-8">
 <div className="grid grid-cols-1 gap-8">
 {PRODUCTS.map((product, i) => (
 <motion.div 
 key={product.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.1 }}
 className="glass-panel overflow-hidden group"
 >
 <div className="flex flex-col xl:flex-row">
 <div className="w-full xl:w-96 h-96 xl:h-auto overflow-hidden relative">
 <img src={product.image} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" alt={product.name} />
 <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent" />
 <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
 <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-landing-divider text-[9px] font-black text-landing-primary tracking-tight">
 Source: {product.source}
 </div>
 <div className="flex items-center gap-2">
 <ShieldCheck size={14} className="text-accent-emerald" />
 <span className="text-[10px] font-black text-landing-primary tracking-tight">Verified</span>
 </div>
 </div>
 </div>
 
 <div className="flex-1 p-10 flex flex-col justify-between space-y-12">
 <div className="space-y-8">
 <div className="flex flex-col md:flex-row justify-between items-start gap-6">
 <div className="space-y-3">
 <h3 className="text-3xl font-black text-landing-primary tracking-tight leading-tight group-hover:text-landing-accent transition-colors">{product.name}</h3>
 <div className="flex flex-wrap gap-3">
 {product.tags.map(tag => (
 <span key={tag} className="text-[10px] font-black text-landing-muted px-3 py-1 rounded-full bg-landing-surface border border-landing-divider tracking-tight">{tag}</span>
 ))}
 </div>
 </div>
 <div className="bg-landing-surface border border-landing-divider p-6 rounded-3xl text-right min-w-[160px]">
 <p className="text-[10px] font-black text-landing-muted tracking-tight mb-1">Target MSRP</p>
 <p className="text-3xl font-black text-landing-primary tabular-nums">${product.price}</p>
 </div>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
 <div>
 <p className="text-[10px] font-black text-landing-muted tracking-tight mb-2">Gross Alpha</p>
 <p className="text-2xl font-black text-accent-emerald tabular-nums">{product.margin}%</p>
 </div>
 <div>
 <p className="text-[10px] font-black text-landing-muted tracking-tight mb-2">Trend Velocity</p>
 <p className="text-2xl font-black text-accent-cyan tabular-nums">{product.trend}/10</p>
 </div>
 <div>
 <p className="text-[10px] font-black text-landing-muted tracking-tight mb-2">Signal Conf.</p>
 <p className="text-2xl font-black text-accent-violet tabular-nums">{product.confidence}%</p>
 </div>
 <div>
 <p className="text-[10px] font-black text-landing-muted tracking-tight mb-2">Ship Latency</p>
 <p className="text-2xl font-black text-landing-primary tabular-nums">4-9d</p>
 </div>
 </div>
 </div>

 <div className="flex items-center justify-between pt-8 border-t border-landing-divider">
 <div className="flex items-center gap-6">
 <button className="flex items-center gap-2 text-xs font-black text-landing-accent hover:text-landing-primary transition-all group/btn">
 Deep Intelligence <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
 </button>
 <div className="h-4 w-px bg-landing-surface" />
 <button className="flex items-center gap-2 text-xs font-black text-landing-muted hover:text-landing-primary transition-colors">
 Competitor Mapping <ExternalLink size={14} />
 </button>
 </div>
 <div className="flex gap-4">
 <button className="px-6 h-12 rounded-xl bg-landing-surface border border-landing-divider text-landing-secondary text-xs font-black hover:text-landing-primary hover:border-landing-divider transition-all tracking-tight">Discard</button>
 <button className="px-8 h-12 rounded-xl bg-landing-accent text-landing-primary text-xs font-black hover:scale-105 active:scale-95 transition-all tracking-tight">Deploy</button>
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </Tabs.Content>

 {/* Profit Modeling Tab */}
 <Tabs.Content value="financials" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 glass-panel p-10 space-y-10">
 <div className="flex items-center justify-between">
 <h3 className="text-xl font-black text-landing-primary tracking-tight tracking-tight">Yield Accuracy & Precision</h3>
 <div className="flex items-center gap-6">
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 rounded-full bg-landing-accent" />
 <span className="text-[10px] font-black text-landing-muted tracking-tight">Discovery Rate</span>
 </div>
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 rounded-full bg-accent-emerald" />
 <span className="text-[10px] font-black text-landing-muted tracking-tight">Signal Precision</span>
 </div>
 </div>
 </div>
 <div className="h-[300px] w-full">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={PERFORMANCE_DATA}>
 <defs>
 <linearGradient id="colDisc" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#4f6ef7" stopOpacity={0.3}/>
 <stop offset="95%" stopColor="#4f6ef7" stopOpacity={0}/>
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.03)" vertical={false} />
 <XAxis dataKey="name" stroke="#3d4f6a" fontSize={10} axisLine={false} tickLine={false} />
 <Tooltip contentStyle={{ backgroundColor: 'rgba(3, 5, 15, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
 <Area type="monotone" dataKey="discovery" stroke="#4f6ef7" fill="url(#colDisc)" strokeWidth={3} />
 <Area type="monotone" dataKey="precision" stroke="#10b981" fill="transparent" strokeWidth={3} strokeDasharray="5 5" />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>
 
 <div className="glass-panel p-10 space-y-8 bg-gradient-to-br from-accent-emerald/10 to-transparent border-accent-emerald/20">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl bg-accent-emerald/10 flex items-center justify-center text-accent-emerald border border-accent-emerald/20">
 <DollarSign size={24} />
 </div>
 <h4 className="text-lg font-black text-landing-primary tracking-tight">Financial Projection</h4>
 </div>
 <div className="space-y-6">
 <div className="flex justify-between items-center">
 <span className="text-sm font-bold text-landing-secondary">Total Projected Revenue</span>
 <span className="text-xl font-black text-landing-primary tabular-nums">$12,480.00</span>
 </div>
 <div className="flex justify-between items-center">
 <span className="text-sm font-bold text-landing-secondary">Estimated Gross Profit</span>
 <span className="text-xl font-black text-accent-emerald tabular-nums">$5,241.60</span>
 </div>
 <div className="h-px bg-landing-surface" />
 <div className="flex justify-between items-center">
 <span className="text-sm font-bold text-landing-secondary">Efficiency Coefficient</span>
 <span className="text-xl font-black text-accent-cyan tabular-nums">1.42x</span>
 </div>
 </div>
 <button className="w-full h-14 rounded-2xl bg-white text-landing-muted font-black text-sm hover:scale-[1.02] active:scale-95 transition-all">
 View Deep Financial Audit
 </button>
 </div>
 </div>
 </Tabs.Content>
 </Tabs.Root>
 </div>
 )
}
