import { MessageSquare, ThumbsDown, Star, Zap, ExternalLink, Activity } from 'lucide-react'

export default function StepRedditOutput({ output }: { output: any }) {
 const analysis = output?.analysis
 const signals = output?.signals
 const sentiment = analysis?.sentiment

 const SentimentColor = 
 sentiment === 'Positive' ? 'text-emerald-400 bg-emerald-400/10' :
 sentiment === 'Negative' ? 'text-red-400 bg-red-400/10' :
 'text-amber-400 bg-amber-400/10'

 return (
 <div className="space-y-6">
 {/* Sentiment & Quick Stats */}
 <div className="flex items-center gap-3">
 {sentiment && (
 <div className={`px-4 py-2 rounded-xl border border-current/10 flex items-center gap-2 ${SentimentColor}`}>
 <Activity className="w-4 h-4" />
 <span className="text-xs font-bold uppercase tracking-wider">{sentiment} Sentiment</span>
 </div>
 )}
 <div className="px-4 py-2 rounded-xl bg-surface-raised border border-surface-border flex items-center gap-2 text-gray-400">
 <MessageSquare className="w-4 h-4" />
 <span className="text-xs font-bold uppercase tracking-wider">{analysis?.mention_count || 0} Mentions</span>
 </div>
 </div>

 {/* Pain Points Summary */}
 {analysis?.pain_points_summary && (
 <div className="p-4 rounded-xl bg-surface-overlay border border-surface-border">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight mb-2">Market Friction Summary</p>
 <p className="text-sm text-gray-200 leading-relaxed italic">"{analysis.pain_points_summary}"</p>
 </div>
 )}

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Complaints */}
 <div className="space-y-3">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight flex items-center gap-2">
 <ThumbsDown className="w-3 h-3 text-red-400" />
 Top Complaints
 </p>
 <div className="space-y-2">
 {analysis?.top_complaints?.map((c: string, i: number) => (
 <div key={i} className="text-xs text-gray-300 bg-surface-raised p-2.5 rounded-lg border border-surface-border flex items-start gap-2">
 <span className="text-red-500/50 mt-0.5">•</span>
 {c}
 </div>
 ))}
 </div>
 </div>

 {/* Desires / Needs */}
 <div className="space-y-3">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight flex items-center gap-2">
 <Star className="w-3 h-3 text-amber-400" />
 Market Gaps / Desires
 </p>
 <div className="space-y-2">
 {analysis?.top_desires?.map((d: string, i: number) => (
 <div key={i} className="text-xs text-gray-300 bg-surface-raised p-2.5 rounded-lg border border-surface-border flex items-start gap-2">
 <span className="text-amber-500/50 mt-0.5">•</span>
 {d}
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Buying Triggers */}
 {analysis?.buying_triggers?.length > 0 && (
 <div className="space-y-3">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight flex items-center gap-2">
 <Zap className="w-3 h-3 text-primary-lighter" />
 Purchase Intent Triggers
 </p>
 <div className="flex flex-wrap gap-2">
 {analysis.buying_triggers.map((t: string, i: number) => (
 <span key={i} className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary-lighter text-[11px] font-bold rounded-full">
 {t}
 </span>
 ))}
 </div>
 </div>
 )}

 {/* Example Threads */}
 <div className="space-y-3">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight">High Relevance Threads</p>
 <div className="space-y-2">
 {(analysis?.example_threads || signals?.example_threads?.slice(0, 3))?.map((t: any, i: number) => (
 <a 
 key={i} 
 href={t.url} 
 target="_blank" 
 rel="noopener noreferrer"
 className="flex items-center justify-between p-3 rounded-xl bg-surface-raised hover:bg-surface-hover border border-surface-border transition-all group"
 >
 <span className="text-xs text-gray-300 group-hover:text-white truncate pr-4">{t.title}</span>
 <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-primary-lighter flex-shrink-0" />
 </a>
 ))}
 {!analysis?.example_threads && !signals?.example_threads && (
 <p className="text-xs text-gray-500 italic">No threads captured.</p>
 )}
 </div>
 </div>
 </div>
 )
}
