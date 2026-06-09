import { Package, Target, Lightbulb, TrendingUp, AlertTriangle, ShieldCheck, Database, Quote } from 'lucide-react'

export default function StepOpportunitiesOutput({ output }: { output: any }) {
 const opportunities = output?.data || []
 const topId = output?.top_opportunity_id

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight flex items-center gap-2">
 Verified Market Opportunities
 </p>
 <span className="text-[10px] text-primary-lighter font-bold uppercase bg-primary/10 px-2 py-0.5 rounded tracking-tighter">
 {opportunities.length} Strategies Identified
 </span>
 </div>

 <div className="space-y-4">
 {opportunities.map((opp: any, i: number) => {
 const isTop = opp.opportunity_id === topId || (i === 0 && !topId)
 
 return (
 <div key={i} className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
 isTop ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/20' : 'bg-surface-raised border-surface-border hover:border-primary/20'
 }`}>
 {isTop && (
 <div className="absolute -top-3 right-6 px-3 py-1 bg-primary rounded-full flex items-center gap-1.5 shadow-lg shadow-primary/20">
 <ShieldCheck className="w-3.5 h-3.5 text-white fill-white/20" />
 <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Gold Standard Thesis</span>
 </div>
 )}

 <div className="flex flex-col md:flex-row gap-6">
 {/* Left Side: Core Thesis */}
 <div className="flex-1 space-y-4">
 <div className="flex items-start justify-between">
 <div>
 <h3 className="text-lg font-bold text-white group-hover:text-primary-lighter transition-colors flex items-center gap-2">
 <Target className="w-5 h-5 text-primary-lighter" />
 {opp.product_idea}
 </h3>
 <p className="text-xs text-gray-400 font-medium mt-1 tracking-tight">{opp.opportunity_id}</p>
 </div>
 <div className="text-right">
 <p className="text-[10px] font-bold text-gray-600 uppercase mb-0.5">Confidence Score</p>
 <p className={`text-xl font-black ${opp.confidence_score > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
 {opp.confidence_score}%
 </p>
 </div>
 </div>

 <div className="relative">
 <Quote className="absolute -top-2 -left-2 w-8 h-8 text-white/5 -z-0" />
 <p className="text-sm text-gray-300 leading-relaxed font-medium relative z-10">
 {opp.thesis_narrative}
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
 <div className="p-3 rounded-xl bg-surface-overlay/50 border border-surface-border">
 <p className="text-[9px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
 <TrendingUp className="w-3 h-3 text-emerald-400" />
 Target Persona
 </p>
 <p className="text-xs text-white font-semibold">{opp.target_customer}</p>
 </div>
 <div className="p-3 rounded-xl bg-surface-overlay/50 border border-surface-border">
 <p className="text-[9px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
 <Zap className="w-3 h-3 text-amber-400" />
 Core USP
 </p>
 <p className="text-xs text-white font-semibold">{opp.usp}</p>
 </div>
 </div>
 </div>

 {/* Right Side: Evidence vs Risks */}
 <div className="w-full md:w-64 space-y-4">
 <div className="space-y-2">
 <p className="text-[9px] font-bold text-gray-500 tracking-tight flex items-center gap-2">
 <Database className="w-3 h-3 text-primary-lighter" />
 Data Evidence
 </p>
 <div className="space-y-1.5">
 {opp.data_evidence?.map((item: string, idx: number) => (
 <div key={idx} className="text-[11px] text-gray-400 leading-snug flex items-start gap-2">
 <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
 {item}
 </div>
 ))}
 </div>
 </div>

 <div className="space-y-2">
 <p className="text-[9px] font-bold text-gray-500 tracking-tight flex items-center gap-2">
 <AlertTriangle className="w-3 h-3 text-red-400" />
 Critical Risks
 </p>
 <div className="space-y-1.5">
 {opp.risk_factors?.map((item: string, idx: number) => (
 <div key={idx} className="text-[11px] text-red-400/[0.7] border border-red-500/10 bg-red-500/5 px-2 py-1 rounded italic leading-snug">
 {item}
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 )
 })}
 </div>

 {opportunities.length === 0 && (
 <div className="p-12 rounded-3xl bg-surface-overlay border-2 border-dashed border-surface-border text-center">
 <Package className="w-12 h-12 text-gray-700 mx-auto mb-4" />
 <p className="text-gray-500 italic">No business opportunities could be synthesized from current data.</p>
 </div>
 )}
 </div>
 )
}

const Zap = ({ className }: { className?: string }) => (
 <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
)
