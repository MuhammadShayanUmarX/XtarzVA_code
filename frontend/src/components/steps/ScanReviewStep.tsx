import { ShieldCheck } from 'lucide-react'

interface Step3Props {
 data: {
 runName: string
 tags: string[]
 sources: string[]
 budget: number[]
 margin: number[]
 }
}

export default function Step3({ data }: Step3Props) {
 return (
 <div className="space-y-10">
 <div className="space-y-2">
 <h2 className="text-2xl font-black text-white">Review Scan</h2>
 <p className="text-sm text-landing-muted">Check your settings before starting the scan.</p>
 </div>

 <div className="p-8 rounded-[40px] bg-white/[0.02] border border-landing-divider space-y-10 relative overflow-hidden">
 <div className="absolute top-0 right-0 p-8 opacity-5">
 <ShieldCheck size={120} className="text-landing-accent" />
 </div>
 
 <div className="grid grid-cols-2 gap-y-10">
 <div className="space-y-2">
 <p className="text-[10px] font-black text-landing-muted tracking-tight">Scan Name</p>
 <p className="text-lg font-bold text-white tracking-tight">{data.runName}</p>
 </div>
 <div className="space-y-2">
 <p className="text-[10px] font-black text-landing-muted tracking-tight">Tags</p>
 <p className="text-lg font-bold text-white tracking-tight">{data.tags.join(' • ')}</p>
 </div>
 <div className="space-y-2">
 <p className="text-[10px] font-black text-landing-muted tracking-tight">Sources</p>
 <p className="text-lg font-bold text-white tracking-tight uppercase">{data.sources.join(', ')}</p>
 </div>
 <div className="space-y-2">
 <p className="text-[10px] font-black text-landing-muted tracking-tight">Settings</p>
 <p className="text-lg font-bold text-white tracking-tight">${data.budget[0]} Budget / {data.margin[0]}% Margin</p>
 </div>
 </div>

 <div className="pt-10 border-t border-landing-divider flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-2 h-2 rounded-full bg-accent-emerald pulse-glow" />
 <span className="text-xs font-bold text-landing-secondary">All Agents Synchronized</span>
 </div>
 <div className="text-xs font-mono text-landing-muted italic">Est. Execution Time: 06:14m</div>
 </div>
 </div>
 </div>
 )
}
