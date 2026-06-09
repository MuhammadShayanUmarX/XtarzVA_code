import { Search, BarChart2, Lightbulb, Shield, Target, Zap, AlertTriangle } from 'lucide-react'

export default function StepSeoOutput({ output }: { output: any }) {
 const data = output?.data || output
 const agentAnalysis = data?.agent_analysis
 const keywordAnalysis = data?.keyword_analysis || []
 const difficulty = data?.overall_difficulty || 'Medium'

 const difficultyColors: Record<string, string> = {
 Easy: 'text-emerald-400 bg-emerald-400/10',
 Medium: 'text-amber-400 bg-amber-400/10',
 Hard: 'text-red-400 bg-red-400/10',
 'Very Hard': 'text-purple-400 bg-purple-400/10',
 }
 const difficultyColor = difficultyColors[difficulty] || 'text-gray-500 bg-gray-500/10'

 return (
 <div className="space-y-6">
 {/* SEO Difficulty Verdict */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {difficulty && (
 <div className={`p-4 rounded-xl border border-current/10 flex items-center justify-between ${difficultyColor}`}>
 <div>
 <p className="text-[10px] font-bold tracking-tight opacity-70">SEO Entry Difficulty</p>
 <p className="text-xl font-bold uppercase tracking-tighter">{difficulty}</p>
 </div>
 <Shield className="w-8 h-8 opacity-80" />
 </div>
 )}

 {agentAnalysis?.best_keyword && (
 <div className="p-4 rounded-xl bg-surface-raised border border-surface-border">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight mb-1">Optimal SEO Keyword</p>
 <p className="text-sm text-white font-bold">{agentAnalysis.best_keyword}</p>
 </div>
 )}
 </div>

 {/* Recommendation */}
 {agentAnalysis?.recommendation && (
 <div className="p-4 rounded-xl bg-surface-overlay border border-surface-border border-l-primary/50 border-l-4">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight mb-1 flex items-center gap-2">
 <Zap className="w-3 h-3 text-primary-lighter" />
 SEO Growth Strategy
 </p>
 <p className="text-sm text-gray-200 font-medium leading-relaxed italic">"{agentAnalysis.recommendation}"</p>
 </div>
 )}

 {/* Detailed Keyword Analysis */}
 <div className="space-y-3">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight flex items-center gap-2">
 SERP Landscape Analysis
 </p>
 <div className="grid grid-cols-1 gap-3">
 {agentAnalysis?.keywords_analysis?.map((ka: any, i: number) => (
 <div key={i} className="p-4 rounded-xl bg-surface-raised border border-surface-border group hover:border-primary/30 transition-all">
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center gap-2">
 <Search className="w-3.5 h-3.5 text-primary-lighter" />
 <span className="text-sm font-bold text-white">{ka.keyword}</span>
 </div>
 <span className={`text-[10px] px-2 py-0.5 rounded font-bold tracking-tight ${
 ka.difficulty_score === 'Easy' ? 'text-emerald-400 bg-emerald-400/10' :
 ka.difficulty_score === 'Hard' || ka.difficulty_score === 'Very Hard' ? 'text-red-400 bg-red-400/10' :
 'text-amber-400 bg-amber-400/10'
 }`}>
 {ka.difficulty_score}
 </span>
 </div>

 <div className="grid grid-cols-2 gap-4 mb-3">
 <div className="flex items-center gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
 <p className="text-[10px] text-gray-400 underline decoration-dotted underline-offset-2 decoration-gray-700">
 {ka.ad_count} Competitor Ads
 </p>
 </div>
 <div className="flex items-center gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
 <p className="text-[10px] text-gray-400">
 {ka.organic_competitors || 10}+ Organic Pages
 </p>
 </div>
 </div>

 <div className="pt-2 border-t border-surface-border">
 <p className="text-[9px] uppercase font-bold text-gray-600 tracking-widest flex items-center gap-1.5 mb-1">
 <Target className="w-2.5 h-2.5 text-emerald-500" />
 Opportunity Gap
 </p>
 <p className="text-[11px] text-gray-300 font-medium italic truncate">{ka.opportunity_gap}</p>
 </div>
 </div>
 ))}
 </div>
 </div>

 {keywordAnalysis.length === 0 && (
 <div className="p-4 rounded-xl bg-surface-overlay border border-surface-border flex items-center gap-3">
 <AlertTriangle className="w-5 h-5 text-gray-600" />
 <p className="text-xs text-gray-500 italic">No search data found. Ensure Serper API is enabled.</p>
 </div>
 )}
 </div>
 )
}
