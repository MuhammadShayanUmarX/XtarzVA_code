import { Search, Target, TrendingUp, BarChart, Palette, ShoppingBag, Brain } from 'lucide-react'
import { cn } from '../../../lib/utils'

export default function AgentDefaults() {
 const agents = [
 { id: 'product_intelligence', name: 'Product Intelligence', icon: Search, color: 'cyan', config: 'Scan Depth: Max, TikTok Signals: On' },
 { id: 'competitor_intelligence', name: 'Competitor Intelligence', icon: Target, color: 'rose', config: 'Price Range: Dynamic, Gap Logic: V2' },
 { id: 'meta_ads_spy', name: 'Ad Creative', icon: Palette, color: 'violet', config: 'SEO + Meta ads + Imagen creatives' },
 { id: 'commerce_creation', name: 'Store Builder', icon: TrendingUp, color: 'emerald', config: 'Shopify OS 2.0 theme ZIP' },
 { id: 'deployment', name: 'Deployment Engine', icon: ShoppingBag, color: 'primary', config: 'Mode: Autonomous Deployment' },
 { id: 'performance_intelligence', name: 'Performance Monitor', icon: BarChart, color: 'amber', config: 'Tracking: Full-Funnel metrics' },
 ]

 return (
 <div className="space-y-12">
 <div className="glass-panel p-10 space-y-10">
 <div className="flex items-center gap-4 mb-2">
 <Brain size={24} className="text-landing-accent" />
 <h2 className="text-xl font-black text-white tracking-tight">AI Agents</h2>
 </div>
 
 <div className="space-y-4">
 {agents.map(a => (
 <div key={a.id} className="p-6 rounded-3xl bg-white/[0.01] border border-landing-divider flex items-center justify-between group hover:border-landing-divider hover:bg-white/[0.02] transition-all">
 <div className="flex items-center gap-6">
 <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110", `bg-accent-${a.color}/10 border-accent-${a.color}/20 text-accent-${a.color}`)}>
 <a.icon size={28} />
 </div>
 <div>
 <h4 className="text-lg font-black text-white tracking-tight">{a.name}</h4>
 <p className="text-xs text-landing-muted font-black tracking-tight mt-1">{a.config}</p>
 </div>
 </div>
 <button className="h-10 px-5 rounded-xl bg-white/5 border border-landing-divider text-[10px] font-black text-landing-secondary tracking-tight hover:text-white hover:border-landing-divider transition-all">
 Configure
 </button>
 </div>
 ))}
 </div>
 </div>
 </div>
 )
}
