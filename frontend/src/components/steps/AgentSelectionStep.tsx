import { Search, Target, TrendingUp, BarChart, Palette, ShoppingBag, MousePointer2, Sparkles, Zap } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function Step2() {
 const agents = [
 { name: 'Product Intelligence', desc: 'Scan Depth: Max, TikTok Signals: On', icon: Search, color: 'cyan' },
 { name: 'Competitor Intelligence', desc: 'Price Range: Dynamic, Gap Logic: V2', icon: Target, color: 'rose' },
 { name: 'Commerce Creation', desc: 'SEO Context: Global, Generation: High-Fidelity', icon: TrendingUp, color: 'emerald' },
 { name: 'Deployment Engine', desc: 'Shopify Sync: Enabled, Multi-Node: Active', icon: Zap, color: 'primary' },
 ]

 return (
 <div className="space-y-8">
 <div className="space-y-2">
 <h2 className="text-2xl font-black text-white">Agent Settings</h2>
 <p className="text-sm text-landing-muted">These AI agents will handle the scan.</p>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {agents.map(a => (
 <div key={a.name} className="p-6 rounded-[32px] bg-white/[0.03] border border-landing-divider flex items-center justify-between group hover:border-white/15 transition-all cursor-pointer">
 <div className="flex items-center gap-5">
 <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110", `bg-accent-${a.color}/10 border-accent-${a.color}/20 text-accent-${a.color}`)}>
 <a.icon size={24} />
 </div>
 <div className="space-y-1">
 <p className="text-sm font-black text-white tracking-tight">{a.name}</p>
 <p className="text-[10px] text-landing-muted font-bold">{a.desc}</p>
 </div>
 </div>
 <div className="text-landing-muted opacity-0 group-hover:opacity-100 transition-opacity">
 <MousePointer2 size={16} />
 </div>
 </div>
 ))}
 <div className="p-6 rounded-[32px] border-2 border-dashed border-landing-divider flex items-center justify-center gap-3 text-landing-muted hover:text-white hover:border-landing-divider transition-all cursor-pointer group">
 <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
 <span className="text-[10px] font-black tracking-tight">Deploy Custom Node</span>
 </div>
 </div>
 </div>
 )
}
