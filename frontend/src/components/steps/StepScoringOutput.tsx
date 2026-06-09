import { Trophy, Award, TrendingUp, DollarSign, Search, ShieldAlert, Zap } from 'lucide-react'

export default function StepScoringOutput({ output }: { output: any }) {
 const ranked = output?.data || []
 const summary = output?.summary

 return (
 <div className="space-y-6">
 {/* Winner Spotlight */}
 {summary && (
 <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-primary/5 border border-amber-500/20 shadow-lg shadow-amber-500/5">
 <div className="flex items-center gap-3 mb-3">
 <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
 <Trophy className="w-6 h-6 text-amber-400" />
 </div>
 <div>
 <p className="text-[10px] text-amber-500 font-bold tracking-tight">Winning Verdict</p>
 <h3 className="text-sm font-bold text-white leading-tight">{output.winner_product}</h3>
 </div>
 </div>
 <p className="text-xs text-amber-100/[0.7] leading-relaxed italic border-l-2 border-amber-500/30 pl-3">
"{summary}"
 </p>
 </div>
 )}

 {/* Leaderboard */}
 <div className="space-y-3">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight flex items-center gap-2">
 Ranked Opportunity Analysis
 </p>
 <div className="space-y-2">
 {ranked.map((o: any, i: number) => (
 <div key={i} className={`p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 ${
 i === 0 ? 'bg-surface-raised border-primary/40 ring-1 ring-primary/20' : 'bg-surface-raised border-surface-border'
 }`}>
 {/* Rank Medallion */}
 <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-lg ${
 i === 0 ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20' :
 i === 1 ? 'bg-gray-200 text-black' :
 i === 2 ? 'bg-amber-700 text-white' : 'bg-surface-overlay text-gray-500'
 }`}>
 {i + 1}
 </div>

 {/* Opportunity Info */}
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 <h4 className="text-sm font-bold text-white truncate">{o.product_idea}</h4>
 <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter ${
 o.badge === 'Winner' ? 'bg-emerald-500/10 text-emerald-400' :
 o.badge === 'Strong' ? 'bg-blue-500/10 text-blue-400' :
 'bg-red-500/10 text-red-400'
 }`}>
 {o.badge}
 </span>
 </div>
 
 {/* Score Breakdown Bar */}
 <div className="flex items-center gap-4 pt-1">
 <div className="flex items-center gap-1.5">
 <TrendingUp className="w-3 h-3 text-gray-500" />
 <span className="text-[10px] text-gray-400 font-bold">{Math.round(o.trend_score)}</span>
 </div>
 <div className="flex items-center gap-1.5">
 <DollarSign className="w-3 h-3 text-gray-500" />
 <span className="text-[10px] text-gray-400 font-bold">{Math.round(o.profit_score)}</span>
 </div>
 <div className="flex items-center gap-1.5">
 <Search className="w-3 h-3 text-gray-500" />
 <span className="text-[10px] text-gray-400 font-bold">{Math.round(o.seo_score)}</span>
 </div>
 </div>
 </div>

 {/* Final Score */}
 <div className="text-right">
 <p className="text-[9px] text-gray-600 font-bold uppercase mb-0.5 tracking-tighter">Weighted Score</p>
 <p className={`text-xl font-black ${i === 0 ? 'text-primary-lighter' : 'text-white'}`}>
 {o.final_score?.toFixed(1)}
 </p>
 </div>
 </div>
 ))}
 </div>
 </div>

 {ranked.length === 0 && (
 <div className="p-8 rounded-2xl bg-surface-overlay border border-surface-border text-center">
 <Zap className="w-8 h-8 text-gray-700 mx-auto mb-3" />
 <p className="text-xs text-gray-500 italic tracking-tight">Waiting for opportunity data...</p>
 </div>
 )}
 </div>
 )
}
