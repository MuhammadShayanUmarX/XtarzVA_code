import { Package, DollarSign, TrendingUp, Star, Truck, Award, AlertCircle } from 'lucide-react'

export default function StepProductResearchOutput({ output }: { output: any }) {
 const data = output?.data || output
 const summary = data?.summary || {}
 const sourcing = data?.sourcing_analysis
 const winners = sourcing?.winning_variants || []

 const VerdictColor = 
 sourcing?.sourcing_verdict === 'Excellent' ? 'text-emerald-400 bg-emerald-400/10' :
 sourcing?.sourcing_verdict === 'Good' ? 'text-blue-400 bg-blue-400/10' :
 'text-red-400 bg-red-400/10'

 return (
 <div className="space-y-6">
 {/* Sourcing Intelligence Header */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {sourcing?.sourcing_verdict && (
 <div className={`p-4 rounded-xl border border-current/10 flex items-center justify-between ${VerdictColor}`}>
 <div>
 <p className="text-[10px] font-bold tracking-tight opacity-70">Sourcing Viability</p>
 <p className="text-xl font-bold uppercase tracking-tighter">{sourcing.sourcing_verdict}</p>
 </div>
 <Award className="w-8 h-8 opacity-80" />
 </div>
 )}

 <div className="p-4 rounded-xl bg-surface-raised border border-surface-border flex items-center justify-between">
 <div>
 <p className="text-[10px] text-gray-500 font-bold tracking-tight mb-1">Average Margin</p>
 <p className="text-xl font-bold text-emerald-400">{sourcing?.avg_margin_percent?.toFixed(1) || summary.estimated_margin_pct || '0'}%</p>
 </div>
 <TrendingUp className="w-8 h-8 text-emerald-500/20" />
 </div>
 </div>

 {/* Winning Variants */}
 <div className="space-y-3">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight flex items-center gap-2">
 Top Sourcing Opportunities
 </p>
 <div className="grid grid-cols-1 gap-3">
 {winners.map((v: any, i: number) => (
 <div key={i} className="p-4 rounded-xl bg-surface-raised border border-surface-border hover:border-primary/30 transition-all group">
 <div className="flex items-start justify-between mb-3 gap-4">
 <div className="flex-1 min-w-0">
 <h4 className="text-sm font-bold text-white truncate group-hover:text-primary-lighter transition-colors">{v.title}</h4>
 <p className="text-[11px] text-gray-400 italic mt-1 leading-snug">"{v.winning_reason}"</p>
 </div>
 <div className="text-right flex-shrink-0">
 <p className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded whitespace-nowrap">
 {v.estimated_margin_percent}% Margin
 </p>
 </div>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-surface-border">
 <div>
 <p className="text-[9px] uppercase font-bold text-gray-600 tracking-tighter mb-0.5">Supplier Cost</p>
 <div className="flex items-center gap-1">
 <DollarSign className="w-2.5 h-2.5 text-gray-500" />
 <p className="text-xs font-bold text-white">${v.supplier_price_usd}</p>
 </div>
 </div>
 <div>
 <p className="text-[9px] uppercase font-bold text-gray-600 tracking-tighter mb-0.5">Suggested Retail</p>
 <div className="flex items-center gap-1">
 <TrendingUp className="w-2.5 h-2.5 text-primary-lighter" />
 <p className="text-xs font-bold text-primary-lighter">${v.suggested_sell_price_usd}</p>
 </div>
 </div>
 <div>
 <p className="text-[9px] uppercase font-bold text-gray-600 tracking-tighter mb-0.5">Rating / Orders</p>
 <div className="flex items-center gap-1.5">
 <div className="flex items-center gap-0.5 text-amber-500">
 <Star className="w-2.5 h-2.5 fill-current" />
 <span className="text-xs font-bold">{v.supplier_rating}</span>
 </div>
 <span className="text-[10px] text-gray-500">({v.order_count})</span>
 </div>
 </div>
 <div>
 <p className="text-[9px] uppercase font-bold text-gray-600 tracking-tighter mb-0.5">Est. Shipping</p>
 <div className="flex items-center gap-1 text-gray-400">
 <Truck className="w-3 h-3" />
 <p className="text-xs font-bold">{v.shipping_days_estimate}d</p>
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {winners.length === 0 && (
 <div className="p-6 rounded-xl bg-surface-overlay border border-surface-dashed border-surface-border text-center">
 <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
 <p className="text-sm text-gray-500 italic">No sourcing variants could be analyzed for this niche.</p>
 </div>
 )}
 </div>
 )
}
