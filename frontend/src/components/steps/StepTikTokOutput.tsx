import { Music, Eye, Zap, TrendingUp, Trophy, AlertCircle, Quote } from 'lucide-react'

export default function StepTikTokOutput({ output }: { output: any }) {
 const analysis = output?.analysis
 const signals = output?.signals || []
 const verdict = analysis?.social_proof_verdict

 const VerdictColor = 
 verdict === 'Strong' ? 'text-pink-400 bg-pink-400/10' :
 verdict === 'Moderate' ? 'text-purple-400 bg-purple-400/10' :
 'text-gray-400 bg-gray-400/10'

 return (
 <div className="space-y-6">
 {/* Social Proof Verdict */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {verdict && (
 <div className={`p-4 rounded-xl border border-current/10 flex items-center justify-between ${VerdictColor}`}>
 <div>
 <p className="text-[10px] font-bold tracking-tight opacity-70">Social Proof Strength</p>
 <p className="text-xl font-bold uppercase tracking-tighter">{verdict}</p>
 </div>
 <Trophy className="w-8 h-8 opacity-80" />
 </div>
 )}

 {analysis?.top_keyword && (
 <div className="p-4 rounded-xl bg-surface-raised border border-surface-border">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight mb-1">Recommended Hook</p>
 <p className="text-sm text-white font-bold">#{analysis.top_keyword}</p>
 </div>
 )}
 </div>

 {/* Recommendation */}
 {analysis?.recommendation && (
 <div className="p-4 rounded-xl bg-surface-overlay border border-surface-border border-l-pink-500/50 border-l-4">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight mb-1 flex items-center gap-2">
 <Zap className="w-3 h-3 text-pink-400" />
 Viral Strategy Recommendation
 </p>
 <p className="text-sm text-gray-200 font-medium leading-relaxed italic">"{analysis.recommendation}"</p>
 </div>
 )}

 {/* Keywords Analysis */}
 <div className="space-y-3">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight flex items-center gap-2">
 Hashtag Velocity Index
 </p>
 <div className="grid grid-cols-1 gap-3">
 {analysis?.keywords_analysis?.map((item: any, i: number) => (
 <div key={i} className="p-4 rounded-xl bg-surface-raised border border-surface-border group hover:border-pink-500/20 transition-all">
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center gap-2">
 <Music className="w-3.5 h-3.5 text-pink-400" />
 <span className="text-sm font-bold text-white">#{item.hashtag || item.keyword}</span>
 </div>
 <span className={`text-[10px] px-2 py-0.5 rounded font-bold tracking-tight ${
 item.view_velocity === 'Exploding' ? 'text-red-400 bg-red-400/10 animate-pulse' :
 item.view_velocity === 'Growing' ? 'text-pink-400 bg-pink-400/10' :
 'text-gray-500 bg-gray-500/10'
 }`}>
 {item.view_velocity}
 </span>
 </div>

 <div className="grid grid-cols-3 gap-2">
 <div>
 <p className="text-[9px] uppercase font-bold text-gray-600 tracking-tighter">Viral Score</p>
 <p className="text-xs font-bold text-pink-400">{item.viral_score}/100</p>
 </div>
 <div>
 <p className="text-[9px] uppercase font-bold text-gray-600 tracking-tighter">Total Views</p>
 <p className="text-xs font-bold text-gray-200">{(item.total_views / 1000000).toFixed(1)}M</p>
 </div>
 <div>
 <p className="text-[9px] uppercase font-bold text-gray-600 tracking-tighter">Volume</p>
 <p className="text-xs font-bold text-gray-200">{(item.video_count / 1000).toFixed(1)}K</p>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Raw Signals (Archive) */}
 {!analysis && signals.length > 0 && (
 <div className="space-y-2">
 {signals.slice(0, 5).map((sig: any, i: number) => (
 <div key={i} className="px-3 py-2 rounded-lg bg-surface-overlay text-xs text-gray-500 border border-surface-border">
 #{sig.keyword}: {(sig.total_views ?? 0).toLocaleString()} views
 </div>
 ))}
 </div>
 )}

 {signals.length === 0 && (
 <div className="p-4 rounded-xl bg-surface-overlay border border-surface-border flex items-center gap-3">
 <AlertCircle className="w-5 h-5 text-gray-600" />
 <p className="text-xs text-gray-500 italic">No TikTok viral data found for these keywords.</p>
 </div>
 )}
 </div>
 )
}
