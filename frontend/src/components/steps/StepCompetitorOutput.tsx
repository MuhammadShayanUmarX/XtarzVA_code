import { Store, ShieldAlert, Target, Zap, AlertTriangle, ExternalLink, Trophy } from 'lucide-react'

export default function StepCompetitorOutput({ output }: { output: any }) {
 const data = output?.data || output
 const agentAnalysis = data?.agent_analysis
 const competitors = data?.competitors || []
 const verdict = agentAnalysis?.competitive_verdict || 'Competitive'

 const verdictColors: Record<string, string> = {
 Open: 'text-emerald-400 bg-emerald-400/10',
 Competitive: 'text-amber-400 bg-amber-400/10',
 Saturated: 'text-red-400 bg-red-400/10',
 }

 const threatColors: Record<string, string> = {
 Low: 'text-emerald-400',
 Medium: 'text-amber-400',
 High: 'text-red-400',
 }

 return (
 <div className="space-y-6">
 {/* Competitive Landscape Verdict */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {verdict && (
 <div className={`p-4 rounded-xl border border-current/10 flex items-center justify-between ${verdictColors[verdict] || verdictColors.Competitive}`}>
 <div>
 <p className="text-[10px] font-bold tracking-tight opacity-70">Market Saturation</p>
 <p className="text-xl font-bold uppercase tracking-tighter">{verdict}</p>
 </div>
 <ShieldAlert className="w-8 h-8 opacity-80" />
 </div>
 )}

 {agentAnalysis?.recommended_positioning && (
 <div className="p-4 rounded-xl bg-surface-raised border border-surface-border">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight mb-1">Recommended Entry</p>
 <p className="text-sm text-white font-bold">{agentAnalysis.recommended_positioning} Positioning</p>
 </div>
 )}
 </div>

 {/* Market Gap Thesis */}
 {agentAnalysis?.market_gap && (
 <div className="p-4 rounded-xl bg-surface-overlay border border-surface-border border-l-blue-500/50 border-l-4">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight mb-1 flex items-center gap-2">
 <Target className="w-3 h-3 text-blue-400" />
 Core Market Gap / Opportunity
 </p>
 <p className="text-sm text-gray-200 font-medium leading-relaxed">"{agentAnalysis.market_gap}"</p>
 </div>
 )}

 {/* Competitor Audit */}
 <div className="space-y-3">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight flex items-center gap-2">
 Competitor Store Intelligence
 </p>
 <div className="grid grid-cols-1 gap-3">
 {agentAnalysis?.competitor_profiles?.map((c: any, i: number) => (
 <div key={i} className="p-4 rounded-xl bg-surface-raised border border-surface-border group hover:border-primary/30 transition-all">
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center gap-2">
 <Store className="w-3.5 h-3.5 text-primary-lighter" />
 <span className="text-sm font-bold text-white">{c.domain}</span>
 {c.is_shopify && <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">Shopify</span>}
 </div>
 <div className="flex items-center gap-2">
 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{c.positioning}</span>
 <div className={`w-2 h-2 rounded-full ${c.threat_level === 'High' ? 'bg-red-500 animate-pulse' : c.threat_level === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4 mb-4">
 <div>
 <p className="text-[9px] uppercase font-bold text-gray-600 tracking-tighter mb-0.5">Price Range</p>
 <p className="text-xs font-bold text-white">${c.price_range_usd?.min} - ${c.price_range_usd?.max}</p>
 </div>
 <div className="text-right">
 <p className="text-[9px] uppercase font-bold text-gray-600 tracking-tighter mb-0.5">Threat Level</p>
 <p className={`text-xs font-bold ${threatColors[c.threat_level] || 'text-gray-500'}`}>{c.threat_level}</p>
 </div>
 </div>

 <div className="pt-2 border-t border-surface-border">
 <p className="text-[9px] uppercase font-bold text-gray-600 tracking-widest flex items-center gap-1.5 mb-1">
 <Zap className="w-2.5 h-2.5 text-amber-500" />
 Identified Weakness
 </p>
 <p className="text-[11px] text-gray-300 font-medium italic truncate">{c.weakness}</p>
 </div>
 </div>
 ))}
 </div>
 </div>

 {competitors.length === 0 && (
 <div className="p-4 rounded-xl bg-surface-overlay border border-surface-border flex items-center gap-3 text-center justify-center">
 <AlertTriangle className="w-5 h-5 text-gray-600" />
 <p className="text-xs text-gray-500 italic">No competitors identified. Ensure competitors stores are online.</p>
 </div>
 )}
 </div>
 )
}
