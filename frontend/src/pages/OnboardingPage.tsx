import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft, 
  Rocket, 
  Target, 
  Shield, 
  Flame, 
  CheckCircle2,
  Loader2,
  Search,
  Swords,
  Calculator,
  TrendingUp,
  Palette,
  Zap,
  Info,
  ShoppingBag,
  Package
} from 'lucide-react'
import * as Switch from '@radix-ui/react-switch'
import * as Slider from '@radix-ui/react-slider'
import confetti from 'canvas-confetti'
import { cn } from '../lib/utils'

// Types
type Step = 1 | 2 | 3 | 4

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1)
  const [direction, setDirection] = useState(0)
  const navigate = useNavigate()

  // State for all steps
  const [storeUrl, setStoreUrl] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  
  const [selectedNiches, setSelectedNiches] = useState<string[]>([])
  const [subNiche, setSubNiche] = useState('')

  const [activeAgents, setActiveAgents] = useState({
    researcher: true, // required
    competitor: true,
    sourcing: true,
    creative: true,
    deployment: true,
    monitor: true
  })

  const [budget, setBudget] = useState([500])
  const [risk, setRisk] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced')
  const [killCriteria, setKillCriteria] = useState(true)

  const nextStep = () => {
    if (step < 4) {
      setDirection(1)
      setStep((s) => (s + 1) as Step)
    } else {
      handleComplete()
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1)
      setStep((s) => (s - 1) as Step)
    }
  }

  const handleComplete = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981']
    })
    setTimeout(() => navigate('/dashboard'), 1500)
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 20 : -20,
      opacity: 0
    })
  }

  return (
    <div className="min-h-screen bg-brand-950 text-brand-50 flex flex-col font-sans selection:bg-accent-primary/30">
      
      {/* Progress Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-brand-700 bg-brand-950/80 backdrop-blur-md z-50 flex items-center justify-between px-8">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-gradient-cta flex items-center justify-center">
              <span className="text-brand-50 text-xs font-bold font-mono">X</span>
           </div>
           <span className="font-display font-bold text-lg tracking-tight hidden sm:block">XtarzVA</span>
        </div>

        <div className="flex items-center gap-12">
           {[1, 2, 3, 4].map((s) => {
             const labels = ["Connect Store", "Your Niche", "Your Crew", "Goals & Budget"]
             const isActive = step === s
             const isCompleted = step > s
             return (
               <div key={s} className="flex flex-col items-center gap-1.5 relative">
                  <div className="flex items-center">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all duration-500 relative",
                      isCompleted ? "bg-accent-primary" : isActive ? "bg-accent-primary" : "bg-brand-800"
                    )}>
                      {isActive && <div className="absolute inset-0 rounded-full border border-accent-primary animate-ping" />}
                    </div>
                    {s < 4 && (
                      <div className={cn(
                        "w-12 h-[1px] ml-1.5",
                        step > s ? "bg-accent-primary" : "bg-brand-800 border-dashed border-t"
                      )} />
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] uppercase font-bold tracking-widest absolute top-6 whitespace-nowrap transition-colors",
                    isActive ? "text-white" : "text-brand-600"
                  )}>
                    {labels[s-1]}
                  </span>
               </div>
             )
           })}
        </div>

        <Link to="/dashboard" className="text-[13px] font-bold text-brand-600 hover:text-brand-400 transition-colors">
          Skip setup →
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 mt-16 pb-32">
        <div className="w-full max-w-[560px] mx-auto overflow-visible relative">
           <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {step === 1 && (
                   <div className="space-y-10 text-center">
                      <div className="flex justify-center flex-col items-center">
                         <div className="w-20 h-20 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center mb-6">
                            <ShoppingBag className="w-10 h-10 text-accent-emerald" />
                         </div>
                         <h2 className="text-3xl font-bold text-brand-50 tracking-tight">First, let's meet your store.</h2>
                         <p className="text-brand-400 mt-2 leading-relaxed">
                            XtarzVA connects to your Shopify store to push listings directly. <br />
                            We need read + write access to products only. We never see customer data or payments.
                         </p>
                      </div>
                      <StepConnectStore 
                        storeUrl={storeUrl} setStoreUrl={setStoreUrl}
                        isConnected={isConnected} setIsConnected={setIsConnected}
                        isConnecting={isConnecting} setIsConnecting={setIsConnecting}
                      />
                   </div>
                 )}
                 {step === 2 && (
                   <div className="space-y-10 text-center">
                      <div className="space-y-4">
                         <h2 className="text-3xl font-bold text-brand-50 tracking-tight">What do you sell?</h2>
                         <p className="text-brand-400 leading-relaxed">
                            Your agents will focus on these categories. Don't overthink it — <br />
                            you can change this any time, or mix niches within a single run.
                         </p>
                      </div>
                      <StepNiche 
                        selectedNiches={selectedNiches} setSelectedNiches={setSelectedNiches}
                        subNiche={subNiche} setSubNiche={setSubNiche}
                      />
                   </div>
                 )}
                 {step === 3 && (
                   <div className="space-y-10 text-center">
                      <div className="space-y-4">
                         <h2 className="text-3xl font-bold text-brand-50 tracking-tight">Meet your crew.</h2>
                         <p className="text-brand-400 leading-relaxed">
                            All 6 agents are active by default. They work in sequence and in parallel — <br />
                            the faster agents (Researcher, SEO) start immediately. The Automator waits for everyone.
                         </p>
                      </div>
                      <StepCrew activeAgents={activeAgents} setActiveAgents={setActiveAgents} />
                   </div>
                 )}
                 {step === 4 && (
                   <div className="space-y-10 text-center">
                      <div className="space-y-4">
                         <h2 className="text-3xl font-bold text-brand-50 tracking-tight">Set your targets.</h2>
                         <p className="text-brand-400 leading-relaxed">
                            This is your safety net. Products that miss your margin target never reach <br />
                            your review queue. You can always adjust this per run.
                         </p>
                      </div>
                      <StepGoals budget={budget} setBudget={setBudget} risk={risk} setRisk={setRisk} killCriteria={killCriteria} setKillCriteria={setKillCriteria} />
                   </div>
                 )}
              </motion.div>
           </AnimatePresence>
        </div>
      </main>

      {/* Navigation Buttons */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 flex justify-center bg-gradient-to-t from-brand-950 via-brand-950 to-transparent">
         <div className="w-full max-w-[560px] flex items-center justify-between">
            <button 
              onClick={prevStep}
              className={cn(
                "flex items-center gap-2 text-sm font-bold text-brand-400 hover:text-brand-50 transition-all px-4 py-2 rounded-lg",
                step === 1 && "opacity-0 pointer-events-none"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button 
              onClick={nextStep}
              disabled={(step === 1 && !isConnected) || (step === 2 && selectedNiches.length === 0)}
              className={cn(
                "flex items-center gap-2 px-8 h-12 rounded-xl font-bold text-[15px] transition-all relative overflow-hidden group",
                (step === 1 && !isConnected) || (step === 2 && selectedNiches.length === 0)
                  ? "bg-brand-900 text-brand-600 cursor-not-allowed"
                  : "bg-gradient-cta text-white shadow-glow hover:scale-[1.03] active:scale-95"
              )}
            >
               {step === 4 ? (
                 <>
                   <Rocket className="w-4 h-4" />
                   Launch Your Dashboard
                 </>
               ) : (
                 <>
                   Continue
                   <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </>
               )}
            </button>
         </div>
      </footer>
    </div>
  )
}

// --- Step 1: Connect Store ---
function StepConnectStore({ storeUrl, setStoreUrl, isConnected, setIsConnected, isConnecting, setIsConnecting }: any) {
  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsConnecting(false)
    setIsConnected(true)
  }

  return (
    <div className="space-y-10 text-center">
       <div className="flex justify-center flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center mb-6">
             <svg className="w-12 h-12 text-accent-emerald" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.5 3.5C4.7 3.5 4 4.2 4 5V19C4 19.8 4.7 20.5 5.5 20.5H18.5C19.3 20.5 20 19.8 20 19V5C20 4.2 19.3 3.5 18.5 3.5H5.5ZM5.5 5H18.5V19H5.5V5ZM12 9L8 13H11V16H13V13H16L12 9Z" />
             </svg>
          </div>
          <h2 className="text-3xl font-bold text-brand-50 tracking-tight">Connect your Shopify store</h2>
          <p className="text-brand-400 mt-2 leading-relaxed">
            XtarzVA needs read + write access to your product catalog. <br />
            We never access customer data or payment info.
          </p>
       </div>

       <div className="space-y-4">
          {!isConnected ? (
            <div className="space-y-4 text-left">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-600 uppercase tracking-widest">Your store URL</label>
                <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-700 text-sm font-medium">https://</div>
                   <input 
                      value={storeUrl}
                      onChange={(e) => setStoreUrl(e.target.value)}
                      placeholder="your-store.myshopify.com"
                      className="w-full h-12 bg-brand-900 border border-brand-700 rounded-xl pl-16 pr-4 text-sm text-brand-50 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20 transition-all font-medium"
                   />
                </div>
                <p className="text-xs text-brand-600 italic">
                   Don't know your store URL? <a href="#" className="text-brand-400 hover:underline">Find it in Shopify Settings →</a>
                </p>
              </div>

              <button 
                onClick={handleConnect}
                disabled={isConnecting || !storeUrl.includes('.myshopify.com')}
                className={cn(
                  "w-full h-12 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3",
                  isConnecting ? "bg-brand-900 text-brand-400" :
                  storeUrl.includes('.myshopify.com') ? "bg-brand-50 text-brand-900 hover:bg-brand-200" : "bg-brand-900 text-brand-700 cursor-not-allowed"
                )}
              >
                {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isConnecting ? "Redirecting to Shopify..." : "Connect via Shopify OAuth →"}
              </button>
            </div>
          ) : (
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="p-6 rounded-2xl bg-accent-emerald/5 border border-accent-emerald/20 flex flex-col items-center gap-4"
            >
               <motion.div 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ type: 'spring', damping: 12 }}
                 className="w-12 h-12 rounded-full bg-accent-emerald/20 flex items-center justify-center text-accent-emerald"
               >
                  <CheckCircle2 size={24} />
               </motion.div>
               <div className="text-center">
                  <p className="text-lg font-bold text-brand-50">Connected successfully</p>
                  <p className="text-sm text-brand-400">📦 My Awesome Store (47 products)</p>
               </div>
               <button onClick={() => setIsConnected(false)} className="text-xs font-bold text-brand-600 hover:text-brand-400 underline">Disconnect</button>
            </motion.div>
          )}

          <div className="p-4 rounded-xl bg-accent-emerald/5 border border-accent-emerald/10 flex items-start gap-4 text-left">
             <ShieldCheck className="w-5 h-5 text-accent-emerald flex-shrink-0 mt-0.5" />
             <p className="text-[12px] text-brand-400 leading-normal font-medium">
                Your store credentials are encrypted with AES-256. <br />
                XtarzVA is a certified Shopify Partner and never stores raw tokens.
             </p>
          </div>
       </div>
    </div>
  )
}

// --- Step 2: Your Niche ---
const NICHES = [
  { label: 'Pet Products', emoji: '🐾' },
  { label: 'Fashion & Apparel', emoji: '👕' },
  { label: 'Home & Garden', emoji: '🏠' },
  { label: 'Beauty & Skincare', emoji: '💄' },
  { label: 'Fitness & Sports', emoji: '💪' },
  { label: 'Tech Accessories', emoji: '📱' },
  { label: 'Kitchen & Dining', emoji: '🍳' },
  { label: 'Kids & Toys', emoji: '🧸' },
  { label: 'Health & Wellness', emoji: '🌿' },
  { label: 'Pet Supplies', emoji: '🐕' },
  { label: 'Gaming', emoji: '🎮' },
  { label: 'Outdoor & Camping', emoji: '🏕️' },
  { label: 'Automotive', emoji: '🚗' },
  { label: 'Books', emoji: '📚' },
  { label: 'Art & Crafts', emoji: '🎨' },
  { label: 'Travel Accessories', emoji: '🧳' }
]

function StepNiche({ selectedNiches, setSelectedNiches, subNiche, setSubNiche }: any) {
  const toggleNiche = (label: string) => {
    if (selectedNiches.includes(label)) {
      setSelectedNiches(selectedNiches.filter((n: string) => n !== label))
    } else if (selectedNiches.length < 3) {
      setSelectedNiches([...selectedNiches, label])
    }
  }

  return (
    <div className="space-y-10 text-center">
       <div className="space-y-4">
          <h2 className="text-3xl font-bold text-brand-50 tracking-tight">What are you selling?</h2>
          <p className="text-brand-400 leading-relaxed">
            Select up to 3 categories. This helps your agents focus <br />
            on the right products from day one.
          </p>
       </div>

       <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
             {NICHES.map(niche => {
               const isSelected = selectedNiches.includes(niche.label)
               return (
                 <button
                   key={niche.label}
                   onClick={() => toggleNiche(niche.label)}
                   className={cn(
                     "flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm transition-all",
                     isSelected 
                      ? "bg-accent-primary/10 border-accent-primary/40 text-brand-50 font-semibold scale-105" 
                      : "bg-brand-900 border-brand-700 text-brand-400 hover:border-brand-600"
                   )}
                 >
                    {isSelected ? <CheckCircle2 className="w-3.5 h-3.5 text-accent-primary" /> : <span>{niche.emoji}</span>}
                    {niche.label}
                 </button>
               )
             })}
          </div>

          <div className="flex items-center justify-between pt-2">
             <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
               {selectedNiches.length} of 3 selected
             </span>
             {selectedNiches.length === 0 && <p className="text-xs text-accent-rose font-medium">Select at least 1 category</p>}
          </div>

          <div className="space-y-3 text-left pt-4">
             <label className="text-[13px] font-bold text-brand-200">Want to be more specific? (optional)</label>
             <input 
               value={subNiche}
               onChange={(e) => setSubNiche(e.target.value)}
               placeholder="e.g. eco-friendly pet accessories, weighted blankets..."
               className="w-full h-12 bg-brand-900 border border-brand-700 rounded-xl px-4 text-sm text-brand-50 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20 transition-all font-medium"
             />
             <p className="text-[11px] text-brand-600 italic">AI agents will prioritize this when scanning trends</p>
          </div>
       </div>
    </div>
  )
}

// --- Step 3: Your AI Crew ---
function StepCrew({ activeAgents, setActiveAgents }: any) {
  const agents = [
    { id: 'researcher', name: 'Product Researcher', desc: 'Finds winning trends', icon: Search, color: 'accent-cyan', required: true },
    { id: 'competitor', name: 'Competitor Analyst', desc: 'Maps your rivals', icon: Swords, color: 'accent-rose' },
    { id: 'sourcing', name: 'Product Sourcer', desc: 'Finds factory prices', icon: Package, color: 'accent-indigo' },
    { id: 'creative', name: 'Commerce Creator', desc: 'Writes copy & images', icon: Palette, color: 'accent-emerald' },
    { id: 'deployment', name: 'Listing Automator', desc: 'Pushes live to Shopify', icon: Zap, color: 'accent-primary', growth: true },
    { id: 'monitor', name: 'Performance Monitor', desc: 'Tracks ROAS & Sales', icon: TrendingUp, color: 'accent-amber', growth: true }
  ]

  return (
    <div className="space-y-10 text-center">
       <div className="space-y-4">
          <h2 className="text-3xl font-bold text-brand-50 tracking-tight">Meet your crew.</h2>
          <p className="text-brand-400 leading-relaxed">
            All 6 agents are enabled by default. Toggle any off to skip <br />
            that step in your runs. You can change this anytime.
          </p>
       </div>

       <div className="space-y-3">
          {agents.map(agent => (
            <div 
              key={agent.id}
              className={cn(
                "p-4 px-5 rounded-xl border flex items-center justify-between transition-all duration-300",
                activeAgents[agent.id as keyof typeof activeAgents] 
                  ? "bg-brand-900 border-brand-700" 
                  : "bg-brand-900/40 border-brand-700 opacity-60"
              )}
            >
               <div className="flex items-center gap-4 text-left">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border", activeAgents[agent.id as keyof typeof activeAgents] ? `bg-${agent.color}/10 border-${agent.color}/20 text-${agent.color}` : "bg-brand-800 border-brand-700 text-brand-600")}>
                     <agent.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-brand-50">{agent.name}</span>
                       {agent.growth && <span className="px-1.5 py-0.5 rounded-full bg-accent-violet/10 text-accent-violet text-[9px] font-bold uppercase tracking-widest border border-accent-violet/20">Growth+</span>}
                    </div>
                    <p className={cn("text-[11px] font-medium leading-tight", activeAgents[agent.id as keyof typeof activeAgents] ? "text-brand-400" : "text-brand-600")}>{agent.desc}</p>
                  </div>
               </div>

               <Switch.Root 
                 checked={activeAgents[agent.id as keyof typeof activeAgents]}
                 onCheckedChange={(val) => {
                    if (agent.required) return
                    setActiveAgents({ ...activeAgents, [agent.id]: val })
                 }}
                 disabled={agent.required}
                 className={cn(
                   "w-10 h-5.5 rounded-full relative transition-colors focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-default",
                   activeAgents[agent.id as keyof typeof activeAgents] ? "bg-accent-primary" : "bg-brand-700",
                   agent.required && "opacity-50"
                 )}
               >
                 <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-1 will-change-transform data-[state=checked]:translate-x-[1.25rem]" />
               </Switch.Root>
            </div>
          ))}
       </div>
    </div>
  )
}

// --- Step 4: Goals & Budget ---
function StepGoals({ budget, setBudget, risk, setRisk, killCriteria, setKillCriteria }: any) {
  return (
    <div className="space-y-10 text-center">
       <div className="space-y-4">
          <h2 className="text-3xl font-bold text-brand-50 tracking-tight">Set your parameters.</h2>
          <p className="text-brand-400 leading-relaxed">
            These defaults apply to every new run. You can override <br />
            them individually per run.
          </p>
       </div>

       <div className="space-y-8 text-left">
          {/* Budget */}
          <div className="space-y-6">
             <div className="space-y-1">
                <div className="flex justify-between items-end">
                   <label className="text-[13px] font-bold text-brand-200">Monthly testing budget</label>
                   <span className="text-2xl font-bold text-accent-primary tracking-tight">${budget[0]}</span>
                </div>
                <p className="text-xs text-brand-600">How much you're comfortable spending to test products per month</p>
             </div>

             <Slider.Root 
               className="relative flex items-center select-none touch-none w-full h-5"
               value={budget}
               onValueChange={setBudget}
               max={5000}
               min={100}
               step={50}
             >
               <Slider.Track className="bg-brand-800 relative grow rounded-full h-[4px]">
                 <Slider.Range className="absolute bg-accent-primary rounded-full h-full" />
               </Slider.Track>
               <Slider.Thumb className="block w-5 h-5 bg-accent-primary shadow-[0_0_20px_rgba(59,130,246,0.6)] rounded-[10px] hover:scale-110 focus:outline-none" />
             </Slider.Root>

             <div className="flex justify-between gap-3">
                {[250, 500, 1000, 2500].map(val => (
                  <button 
                    key={val}
                    onClick={() => setBudget([val])}
                    className={cn(
                      "flex-1 py-2 rounded-lg border text-xs font-bold transition-all",
                      budget[0] === val ? "bg-accent-primary/10 border-accent-primary/40 text-accent-primary" : "bg-brand-900 border-brand-700 text-brand-600 hover:border-brand-700"
                    )}
                  >
                     ${val}
                  </button>
                ))}
             </div>

             <div className="p-4 rounded-xl bg-brand-900 border border-brand-700 flex items-center gap-3">
                <Info size={16} className="text-brand-600" />
                <p className="text-[12px] text-brand-400">
                   Estimated <span className="text-brand-50 font-bold">{Math.floor(budget[0]/50)} test runs</span> per month at $50/run average.
                </p>
             </div>
          </div>

          {/* Risk */}
          <div className="space-y-4">
             <label className="text-[13px] font-bold text-brand-200">Risk tolerance</label>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'conservative', title: 'Conservative', desc: 'Margin >35%. High confidence.', icon: Shield, color: 'text-accent-emerald' },
                  { id: 'balanced', title: 'Balanced', desc: 'Margin >20%. Safety & Growth.', icon: Target, color: 'text-accent-primary', recommended: true },
                  { id: 'aggressive', title: 'Aggressive', desc: 'Margin >10%. Faster learning.', icon: Flame, color: 'text-accent-rose' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRisk(r.id)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all space-y-3 relative overflow-hidden",
                      risk === r.id 
                        ? "bg-accent-primary/5 border-accent-primary/40 scale-[1.02]" 
                        : "bg-brand-900/60 border-brand-700 opacity-60 hover:opacity-100"
                    )}
                  >
                     {r.recommended && <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary text-[8px] font-bold uppercase">Rec</span>}
                     <r.icon className={cn("w-5 h-5", r.color)} />
                     <div className="space-y-1">
                        <p className="text-sm font-bold text-brand-50">{r.title}</p>
                        <p className="text-[10px] text-brand-400 leading-tight font-medium">{r.desc}</p>
                     </div>
                  </button>
                ))}
             </div>
          </div>

          {/* Kill Criteria */}
          <div className="p-5 rounded-2xl bg-brand-900 border border-brand-700 flex items-center justify-between">
             <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <span className="text-[14px] font-bold text-brand-50">Enable Kill Criteria</span>
                   <span className="px-1.5 py-0.5 rounded-full bg-accent-emerald/10 text-accent-emerald text-[8px] font-bold uppercase">Active</span>
                </div>
                <p className="text-[11px] text-brand-400 max-w-[320px]">
                   Auto-flag products that fall below your margin threshold, so you never accidentally launch a loser.
                </p>
             </div>
             <Switch.Root 
                checked={killCriteria}
                onCheckedChange={setKillCriteria}
                className={cn(
                  "w-10 h-5.5 rounded-full relative transition-colors focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-default",
                  killCriteria ? "bg-accent-emerald" : "bg-brand-700"
                )}
             >
                <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-1 will-change-transform data-[state=checked]:translate-x-[1.25rem]" />
             </Switch.Root>
          </div>
       </div>
    </div>
  )
}
