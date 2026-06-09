import { CheckCircle2, FileText, Sparkles, Trophy } from 'lucide-react'

export default function StepSynthesisOutput({ output }: { output: any }) {
 return (
 <div className="relative overflow-hidden group p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-primary/5 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
 <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
 <Trophy className="w-24 h-24 text-emerald-400" />
 </div>

 <div className="flex items-start gap-4">
 <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
 <CheckCircle2 className="w-7 h-7 text-emerald-400" />
 </div>
 
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-1">
 <h3 className="text-lg font-bold text-white">Full Intelligence Synthesis Complete</h3>
 <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded tracking-tight">Investment Grade</span>
 </div>
 <p className="text-sm text-gray-400 leading-relaxed max-w-md">
 Agent 11 has successfully collapsed all 10 preceding data streams into your final investment-grade report. 
 </p>
 
 <div className="mt-4 flex items-center gap-4 text-[10px] font-bold text-gray-500 tracking-tight">
 <div className="flex items-center gap-1.5">
 <Sparkles className="w-3 h-3 text-amber-400" />
 11 Agents Synced
 </div>
 <div className="flex items-center gap-1.5">
 <FileText className="w-3 h-3 text-primary-lighter" />
 Markdown Optimized
 </div>
 </div>
 </div>
 </div>
 </div>
 )
}
