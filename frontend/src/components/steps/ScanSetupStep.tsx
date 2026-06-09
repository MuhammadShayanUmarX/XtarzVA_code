import { X } from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'
import { cn } from '../../lib/utils'

interface Step1Props {
 runName: string
 setRunName: (v: string) => void
 tags: string[]
 setTags: (v: string[]) => void
 sources: string[]
 setSources: (v: string[]) => void
 budget: number[]
 setBudget: (v: number[]) => void
 margin: number[]
 setMargin: (v: number[]) => void
}

export default function Step1({ 
 runName, setRunName, 
 tags, setTags,
 sources, setSources,
 budget, setBudget,
 margin, setMargin
}: Step1Props) {
 return (
 <div className="space-y-12">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-3">
 <label className="text-xs font-black text-landing-muted tracking-tight">Scan Name</label>
 <input 
 value={runName}
 onChange={e => setRunName(e.target.value)}
 className="command-input w-full"
 placeholder="e.g. Q4 Viral Pet Products"
 />
 </div>
 
 <div className="space-y-3">
 <label className="text-xs font-black text-landing-muted tracking-tight">Tags</label>
 <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-white/[0.03] border border-landing-divider min-h-[52px]">
 {tags.map((t: string) => (
 <span key={t} className="px-3 py-1 rounded-xl bg-landing-accent/10 border border-landing-accent/20 text-landing-accent text-xs font-bold flex items-center gap-2">
 {t} <X size={12} className="cursor-pointer" onClick={() => setTags(tags.filter(x => x !== t))} />
 </span>
 ))}
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-xs font-black text-landing-muted tracking-tight">Sources</label>
 <div className="flex flex-wrap gap-3">
 {[
 { id: 'tiktok', label: 'TikTok Velocity' },
 { id: 'reddit', label: 'Reddit Clusters' },
 { id: 'aliexpress', label: 'AliExpress Direct' },
 { id: 'amazon', label: 'Amazon Movers' },
 { id: 'meta', label: 'Meta Library' },
 ].map(s => (
 <button 
 key={s.id}
 onClick={() => setSources(sources.includes(s.id) ? sources.filter(x => x !== s.id) : [...sources, s.id])}
 className={cn(
"px-6 h-12 rounded-2xl text-xs font-bold border transition-all",
 sources.includes(s.id) ?"bg-white text-landing-muted border-white" :"bg-white/[0.03] border-landing-divider text-landing-muted hover:text-white"
 )}
 >
 {s.label}
 </button>
 ))}
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
 <div className="space-y-6">
 <div className="flex justify-between items-end">
 <label className="text-xs font-black text-landing-muted tracking-tight">Budget</label>
 <span className="text-2xl font-black text-white">${budget[0]}</span>
 </div>
 <Slider.Root 
 className="relative flex items-center select-none touch-none w-full h-5"
 value={budget}
 onValueChange={setBudget}
 max={5000}
 step={100}
 >
 <Slider.Track className="bg-white/5 relative grow rounded-full h-1.5">
 <Slider.Range className="absolute bg-landing-accent rounded-full h-full" />
 </Slider.Track>
 <Slider.Thumb className="block w-5 h-5 bg-white border-4 border-landing-divider rounded-full shadow-2xl focus:outline-none transition-transform hover:scale-110" />
 </Slider.Root>
 </div>

 <div className="space-y-6">
 <div className="flex justify-between items-end">
 <label className="text-xs font-black text-landing-muted tracking-tight">Minimum Margin</label>
 <span className="text-2xl font-black text-white">{margin[0]}%</span>
 </div>
 <Slider.Root 
 className="relative flex items-center select-none touch-none w-full h-5"
 value={margin}
 onValueChange={setMargin}
 max={100}
 step={1}
 >
 <Slider.Track className="bg-white/5 relative grow rounded-full h-1.5">
 <Slider.Range className="absolute bg-landing-accent rounded-full h-full" />
 </Slider.Track>
 <Slider.Thumb className="block w-5 h-5 bg-white border-4 border-landing-divider rounded-full shadow-2xl focus:outline-none transition-transform hover:scale-110" />
 </Slider.Root>
 </div>
 </div>
 </div>
 )
}
