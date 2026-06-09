import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
 Zap, 
 Rocket,
 Terminal,
 Link as LinkIcon,
 Search,
 Target,
 BarChart2,
 TrendingUp,
 Package
} from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '../../lib/utils'
import { useRunStore } from '../../store/runStore'

// Components
import LaunchOverlay from '../../components/ui/LaunchOverlay'
import Step1 from '../../components/steps/ScanSetupStep'

export default function NewRunPage() {
 const navigate = useNavigate()
 const startRun = useRunStore(state => state.startRun)

 // Form State
 const [runName, setRunName] = useState('Scan — ' + new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))
 const [query, setQuery] = useState('')
 const [targetUrls, setTargetUrls] = useState<string[]>([])
 const [currentUrl, setCurrentUrl] = useState('')
 
 const [tags, setTags] = useState(['Viral', 'High-Margin'])
 const [sources, setSources] = useState(['tiktok', 'reddit', 'aliexpress', 'amazon'])
 const [budget, setBudget] = useState([500])
 const [margin, setMargin] = useState([35])

 const [isLaunching, setIsLaunching] = useState(false)

 const handleAddUrl = () => {
 if (currentUrl && currentUrl.startsWith('http')) {
 setTargetUrls([...targetUrls, currentUrl])
 setCurrentUrl('')
 } else {
 toast.error('Please enter a valid URL')
 }
 }

 const handleLaunch = async () => {
 if (!query) {
 toast.error('Please enter a search query.')
 return
 }

 setIsLaunching(true)
 try {
 const config = {
 name: runName,
 query: query,
 target_urls: targetUrls,
 tags: tags,
 sources: sources,
 budget: budget[0],
 margin: margin[0]
 }
 
 const runId = await startRun(config)
 
 toast.success('Research started! Tracking progress...', {
 position: 'top-right',
 style: { background: '#080d1e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
 })
 
 setTimeout(() => {
 navigate(`/dashboard/workflow?run_id=${runId}`)
 }, 2000)
 
 } catch (error) {
 toast.error('Backend synchronization failed.')
 setIsLaunching(false)
 }
 }

 return (
 <div className="max-w-7xl mx-auto space-y-12 pb-32 px-4 md:px-8">
 <LaunchOverlay isLaunching={isLaunching} />

 <header className="space-y-4">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl bg-landing-accent/10 border border-landing-accent/20 flex items-center justify-center text-landing-accent">
 <Zap size={24} fill="currentColor" />
 </div>
 <h1 className="text-4xl font-black text-landing-primary tracking-tight">New <span className="text-landing-muted">Scan</span></h1>
 </div>
 <p className="text-lg text-landing-secondary font-medium leading-relaxed max-w-2xl">
 Run the full pipeline — product discovery, competitor analysis, sourcing, and store content in one workflow.
 </p>
 </header>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
 {/* Left: Configuration Form */}
 <div className="lg:col-span-2 space-y-12">
 
 <section className="space-y-8">
 {/* MISSION BRIEF (QUERY) */}
 <div className="space-y-4">
 <div className="flex items-center gap-2 text-[10px] font-black text-landing-muted tracking-tight">
 <Terminal size={12} />
 What do you want to research?
 </div>
 <div className="relative group">
 <textarea 
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 className="w-full h-40 bg-landing-surface border border-landing-divider rounded-[32px] p-8 text-white text-xl font-medium focus:outline-none focus:border-landing-accent/50 transition-all placeholder:text-landing-muted"
 placeholder="Describe the niche or product idea (e.g. Ergonomic pet travel gear for nomadic owners...)"
 />
 <div className="absolute top-6 right-6 opacity-20">
 <Zap size={28} className="text-landing-accent" />
 </div>
 </div>
 </div>

 {/* TARGET URLS */}
 <div className="space-y-4">
 <div className="flex items-center gap-2 text-[10px] font-black text-landing-muted tracking-tight">
 <LinkIcon size={12} />
 Contextual Anchors (Target URLs)
 </div>
 <div className="flex gap-4">
 <input 
 value={currentUrl}
 onChange={(e) => setCurrentUrl(e.target.value)}
 className="flex-1 h-16 bg-landing-surface border border-landing-divider rounded-2xl px-6 text-sm text-white focus:outline-none focus:border-landing-accent/50 transition-all placeholder:text-landing-muted"
 placeholder="Paste competitor URL or trend article..."
 />
 <button 
 onClick={handleAddUrl}
 className="h-16 px-10 rounded-2xl bg-landing-surface border border-landing-divider text-landing-primary font-bold hover:bg-landing-surface transition-all shadow-xl active:scale-95"
 >
 Add Anchor
 </button>
 </div>
 <div className="flex flex-wrap gap-3">
 {targetUrls.map((url, i) => (
 <div key={i} className="px-5 py-2.5 rounded-2xl bg-landing-accent/10 border border-landing-accent/20 text-[11px] font-bold text-landing-primary flex items-center gap-3">
 <span className="max-w-[250px] truncate">{url}</span>
 <button onClick={() => setTargetUrls(targetUrls.filter((_, idx) => idx !== i))} className="hover:text-accent-rose text-lg">×</button>
 </div>
 ))}
 </div>
 </div>

 {/* PARAMETERS (Scan Name, Tags, Sources, Sliders) */}
 <div className="p-10 rounded-[40px] bg-landing-surface border border-landing-divider space-y-12">
 <Step1 
 runName={runName} setRunName={setRunName} 
 tags={tags} setTags={setTags}
 sources={sources} setSources={setSources}
 budget={budget} setBudget={setBudget}
 margin={margin} setMargin={setMargin}
 />
 </div>
 </section>

 {/* AUTHORIZE BUTTON */}
 <div className="pt-10 border-t border-landing-divider">
 <button 
 onClick={handleLaunch}
 className="cta-button w-full h-20 rounded-3xl text-lg font-black tracking-widest hover: active:scale-[0.98] transition-all"
 >
 <Rocket size={24} className="animate-bounce" /> 
 AUTHORIZE MISSION & DEPLOY AGENTS
 </button>
 <p className="text-center mt-6 text-xs text-landing-muted font-medium">
 By starting this scan, you agree to run all pipeline stages sequentially with review at each step.
 </p>
 </div>
 </div>

 {/* Right: Agent Status / Summary */}
 <aside className="space-y-8">
 <div className="sticky top-28 space-y-8">
 <div className="glass-panel p-8 space-y-8">
 <h3 className="text-[10px] font-black text-landing-muted tracking-tight">Pipeline Stages</h3>
 <div className="space-y-6">
 {[
 { label: 'Product Discovery', role: 'Research', icon: Search, color: 'cyan' },
 { label: 'Competitor Intel', role: 'Analysis', icon: Target, color: 'rose' },
 { label: 'Sourcing', role: 'Suppliers', icon: Package, color: 'indigo' },
 { label: 'Store Builder', role: 'Content', icon: TrendingUp, color: 'emerald' },
 ].map((s, i) => (
 <div key={i} className="flex items-center gap-4">
 <div className={cn(`w-10 h-10 rounded-xl bg-accent-${s.color}/10 border border-accent-${s.color}/20 flex items-center justify-center text-accent-${s.color}`)}>
 <s.icon size={18} />
 </div>
 <div className="flex-1">
 <p className="text-xs font-black text-landing-primary">{s.label}</p>
 <p className="text-[10px] font-bold text-landing-muted tracking-tight">{s.role}</p>
 </div>
 <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
 </div>
 ))}
 </div>
 </div>

 <div className="glass-panel p-8 bg-gradient-to-br from-accent-primary/10 to-transparent border-landing-accent/20 space-y-6">
 <div className="flex items-center gap-3 text-landing-accent">
 <TrendingUp size={20} />
 <h3 className="text-[10px] font-black text-landing-primary tracking-tight">Projection</h3>
 </div>
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-landing-muted">Expected Margin</span>
 <span className="text-sm font-black text-landing-primary">~{margin[0] + 15}%</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-landing-muted">Research Depth</span>
 <span className="text-sm font-black text-landing-primary">Advanced</span>
 </div>
 </div>
 </div>
 </div>
 </aside>
 </div>
 </div>
 )
}
