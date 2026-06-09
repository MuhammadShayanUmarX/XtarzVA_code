import { TrendingUp, TrendingDown, Minus, Flame, Thermometer, Wind, AlertCircle } from 'lucide-react'

export default function StepTrendsOutput({ output }: { output: any }) {
 const analysis = output?.analysis
 const signals = output?.signals || []
 const verdict = analysis?.overall_verdict

 const VerdictIcon = verdict === 'Hot' ? Flame : verdict === 'Warm' ? Thermometer : Wind
 const VerdictColor = verdict === 'Hot' ? 'text-orange-400 bg-orange-400/10' : verdict === 'Warm' ? 'text-amber-400 bg-amber-400/10' : 'text-blue-400 bg-blue-400/10'

 return (
 <div className="space-y-6">
 {/* Overall Verdict */}
 {verdict && (
 <div className={`p-4 rounded-xl border flex items-center justify-between ${VerdictColor} border-current/10`}>
 <div>
 <p className="text-[10px] font-bold tracking-tight opacity-70">Market Temperature</p>
 <p className="text-xl font-bold uppercase tracking-tighter">{verdict}</p>
 </div>
 <VerdictIcon className="w-8 h-8 opacity-80" />
 </div>
 )}

 {/* Keywords Analysis */}
 <div className="space-y-3">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight flex items-center gap-2">
 Detailed Market Signals
 </p>
 <div className="grid grid-cols-1 gap-3">
 {analysis?.keywords_analysis?.map((item: any, i: number) => (
 <div key={i} className="p-4 rounded-xl bg-surface-raised border border-surface-border">
 <div className="flex items-center justify-between mb-2">
 <h4 className="text-sm font-bold text-white">{item.keyword}</h4>
 <span className={`text-[10px] px-2 py-0.5 rounded font-bold tracking-tight ${
 item.trend_direction === 'Rising' ? 'text-emerald-400 bg-emerald-400/10' :
 item.trend_direction === 'Falling' ? 'text-red-400 bg-red-400/10' :
 'text-gray-400 bg-gray-400/10'
 }`}>
 {item.trend_direction}
 </span>
 </div>
 <p className="text-[11px] text-gray-400 italic mb-3">"{item.recommendation}"</p>
 <div className="flex items-center gap-4">
 <div>
 <p className="text-[9px] uppercase font-bold text-gray-600 tracking-tighter">Confidence</p>
 <p className={`text-[10px] font-bold ${item.confidence === 'High' ? 'text-emerald-500' : 'text-amber-500'}`}>{item.confidence}</p>
 </div>
 <div>
 <p className="text-[9px] uppercase font-bold text-gray-600 tracking-tighter">Peak</p>
 <p className="text-[10px] text-gray-300 font-bold uppercase">{item.peak_month || 'Steady'}</p>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Raw Signals (Mini version) */}
 {signals.length > 0 && (
 <div className="pt-2">
 <p className="text-[10px] text-gray-600 font-bold tracking-tight mb-2 px-1">Raw Signals Archive</p>
 <div className="flex flex-wrap gap-1.5 leading-none">
 {signals.map((s: any, i: number) => (
 <span key={i} className="text-[9px] text-gray-500 bg-surface-overlay px-2 py-1 rounded border border-surface-border">
 {s.keyword}: {s.direction}
 </span>
 ))}
 </div>
 </div>
 )}
 </div>
 )
}
