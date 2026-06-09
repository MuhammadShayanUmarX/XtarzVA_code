import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Terminal, Search, Swords, Calculator, Palette, TrendingUp, 
  Send, CheckCircle2, Loader2, Activity, Zap,
  BarChart3, ShieldCheck, Cpu
} from 'lucide-react'

const STEPS = [
  {
    id: 'research',
    agent: 'Research Specialist',
    icon: Search,
    color: '#3E63DD',
    status: 'SCANNING_SIGNALS',
    message: 'Analyzing 1,240 TikTok trends and Reddit velocity signals...',
    details: ['Found: 14 high-velocity signals', 'Analyzing saturation: 12%', 'Predictive win-rate: 84%'],
    stat: '1,240 signals',
    statLabel: 'Velocity Scan',
    packet: '2.4kb',
    latency: '12ms'
  },
  {
    id: 'analyze',
    agent: 'Market Strategist',
    icon: Swords,
    color: '#8DA4EF',
    status: 'VALIDATING_NICHE',
    message: 'Mapping competitor pricing and identifying market gaps...',
    details: ['Competitor avg: $24.99', 'Low saturation gap found', 'Profit potential: High'],
    stat: '42 rivals',
    statLabel: 'Market Rivals',
    packet: '1.8kb',
    latency: '24ms'
  },
  {
    id: 'finance',
    agent: 'Profit Architect',
    icon: Calculator,
    color: '#D2F13C',
    status: 'AUDITING_MARGINS',
    message: 'Calculating landed costs and Shopify net margins...',
    details: ['COGS: $4.12', 'Shipping: $5.20', 'Net Margin: 62.4%'],
    stat: '62.4%',
    statLabel: 'Net Margin',
    packet: '0.8kb',
    latency: '8ms'
  },
  {
    id: 'creative',
    agent: 'Creative Director',
    icon: Palette,
    color: '#3E63DD',
    status: 'RENDERING_ASSETS',
    message: 'Generating studio-quality lifestyle and product visuals...',
    details: ['Lifestyle render complete', 'Ad variant A/B generated', 'Brand style sync: 100%'],
    stat: '12 assets',
    statLabel: 'AI Renders',
    packet: '142.4kb',
    latency: '280ms'
  },
  {
    id: 'seo',
    agent: 'SEO Strategist',
    icon: TrendingUp,
    color: '#8DA4EF',
    status: 'OPTIMIZING_COPY',
    message: 'Writing conversion-optimized listings and metadata...',
    details: ['Keywords injected: 14', 'Title score: 98/100', 'Meta tags active'],
    stat: '98/100',
    statLabel: 'SEO Score',
    packet: '3.1kb',
    latency: '15ms'
  },
  {
    id: 'sync',
    agent: 'Operations Engine',
    icon: Send,
    color: '#D2F13C',
    status: 'PUSHING_TO_STORE',
    message: 'Finalizing Shopify API payload and publishing live...',
    details: ['Images uploaded', 'Variants synced', 'Live at: /products/pet-dryer'],
    stat: '4m 12s',
    statLabel: 'Time to Live',
    packet: '8.4kb',
    latency: '14ms'
  }
]

export default function LiveDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    if (currentStep < STEPS.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, `[${STEPS[currentStep].agent.toUpperCase()}] ${STEPS[currentStep].message}`])
        if (currentStep === STEPS.length - 1) {
          setIsComplete(true)
        } else {
          setCurrentStep(prev => prev + 1)
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  const handleReset = () => {
    setCurrentStep(0)
    setIsComplete(false)
    setLogs([])
  }

  return (
    <section id="demo" className="py-32 bg-landing-bg relative overflow-hidden border-t border-landing-divider/10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-landing-accent">OPERATIONAL SYSTEM SIMULATION</span>
          <h2 className="text-4xl md:text-5xl font-black text-landing-primary tracking-tightest mt-4">
            Watch the Swarm <br />
            <span className="text-landing-accent">In Real Time.</span>
          </h2>
          <p className="text-base text-landing-secondary max-w-2xl mx-auto mt-4">
            Experience elite e-commerce automation. Track the sequence of parallel actions as they develop and listing updates synch to Shopify.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Interactive pipeline timeline */}
          <div className="lg:col-span-4 space-y-3">
             {STEPS.map((step, i) => {
               const isActive = i === currentStep
               const isPast = i < currentStep
               return (
                 <div
                   key={step.id}
                   className={`p-4 rounded-lg border transition-all duration-300 ${
                     isActive 
                       ? 'bg-landing-surface border-landing-accent/40 shadow-lg' 
                       : 'bg-landing-surface/30 border-landing-divider/20 opacity-85'
                   }`}
                 >
                   <div className="flex items-center gap-4">
                     <div 
                       className="w-8 h-8 rounded flex items-center justify-center border transition-all"
                       style={{ 
                         backgroundColor: isPast || isActive ? `${step.color}15` : 'transparent',
                         borderColor: isPast || isActive ? `${step.color}35` : '#334155'
                       }}
                     >
                       {isPast ? (
                         <CheckCircle2 className="w-4 h-4 text-landing-accentLime" />
                       ) : (
                         <step.icon className="w-4 h-4" style={{ color: isActive ? step.color : '#64748B' }} />
                       )}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-landing-muted">{step.agent}</p>
                        <p className={`text-xs font-bold ${isActive ? 'text-landing-primary' : 'text-landing-secondary'}`}>{step.status}</p>
                     </div>
                     {isActive && <Loader2 className="w-3.5 h-3.5 text-landing-accent animate-spin" />}
                   </div>
                 </div>
               )
             })}
          </div>

          {/* Right: High-Fidelity Telemetry Console */}
          <div className="lg:col-span-8 flex flex-col h-full">
            <div className="landing-panel overflow-hidden border border-landing-divider/40 flex flex-col min-h-[580px] justify-between">
              
              {/* Header */}
              <div className="px-6 py-4 bg-landing-surface/90 border-b border-landing-divider/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="flex gap-1.5">
                     <div className="w-2.5 h-2.5 rounded-full bg-landing-divider/40" />
                     <div className="w-2.5 h-2.5 rounded-full bg-landing-divider/40" />
                     <div className="w-2.5 h-2.5 rounded-full bg-landing-divider/40" />
                   </div>
                   <div className="h-3 w-px bg-landing-divider/30 ml-2" />
                   <span className="text-[10px] font-mono font-bold text-landing-primary uppercase tracking-widest flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-landing-accent" /> xtarz_mission_control.sh
                   </span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-landing-accent/15 border border-landing-accent/25">
                  <Activity className="w-3 h-3 text-landing-accent animate-pulse" />
                  <span className="text-[9px] font-mono text-landing-accent uppercase font-bold tracking-widest">REAL_TIME</span>
                </div>
              </div>

              {/* Console Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'COGNITIVE ACCURACY', val: '98.4%', icon: ShieldCheck, color: 'text-landing-accentLime' },
                    { label: 'LAUNCH TIME', val: '4m 12s', icon: Zap, color: 'text-landing-accent' },
                    { label: 'CPU NODE STABILITY', val: '100%', icon: Cpu, color: 'text-landing-accentSoft' }
                  ].map((stat, i) => (
                    <div key={i} className="p-4 bg-landing-surface border border-landing-divider/25 rounded-lg space-y-1">
                      <p className="text-[9px] font-bold text-landing-muted uppercase tracking-wider">{stat.label}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black text-landing-primary tabular-nums">{stat.val}</span>
                        <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Central Status Window (Orchestration Progress Matrix) */}
                <div className="p-6 bg-landing-surface/30 border border-landing-divider/20 rounded-xl space-y-4">
                  <div className="flex justify-between items-center text-[9px] font-mono font-bold text-landing-muted uppercase tracking-widest">
                    <span>ACTIVE ORCHESTRATION TIMELINE MATRIX</span>
                    <span className="text-landing-accent">RUN STATUS: {isComplete ? 'LAUNCH_READY' : 'PROCESSING'}</span>
                  </div>

                  <table className="w-full text-left font-mono text-[10px] text-landing-secondary">
                    <thead>
                      <tr className="border-b border-landing-divider/30 text-landing-muted pb-2">
                        <th className="pb-2">Execution Node</th>
                        <th className="pb-2 text-right">Data Packet</th>
                        <th className="pb-2 text-right">Latency</th>
                        <th className="pb-2 text-right">Compliance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STEPS.map((step, i) => {
                        const isPast = i < currentStep
                        const isActive = i === currentStep
                        return (
                          <tr key={step.id} className={isActive ? 'text-landing-primary font-bold' : isPast ? 'text-landing-secondary' : 'text-landing-muted opacity-40'}>
                            <td className="py-1.5 flex items-center gap-1.5">
                              {isPast && <CheckCircle2 className="w-3 h-3 text-landing-accentLime" />}
                              {isActive && <Loader2 className="w-3 h-3 text-landing-accent animate-spin" />}
                              {!isPast && !isActive && <div className="w-3 h-3" />}
                              {step.agent}
                            </td>
                            <td className="py-1.5 text-right">{step.packet}</td>
                            <td className="py-1.5 text-right">{step.latency}</td>
                            <td className="py-1.5 text-right">
                              {isPast || isActive ? (
                                <span className="text-landing-accentLime font-bold">✓ PASS</span>
                              ) : (
                                <span className="text-landing-muted">— PENDING</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Live Console Logs */}
                <div className="p-4 bg-landing-bg border border-landing-divider/50 rounded-lg font-mono text-[10px] text-landing-secondary h-28 overflow-y-auto space-y-1">
                  {logs.map((log, i) => (
                    <p key={i} className="text-landing-muted font-bold">&gt; {log}</p>
                  ))}
                  {!isComplete && <p className="text-landing-accent animate-pulse">&gt; _</p>}
                </div>
              </div>

              {/* Console Footer */}
              <div className="px-6 py-4 bg-landing-surface/90 border-t border-landing-divider/40 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[9px] font-bold text-landing-muted uppercase tracking-widest">Elapsed Time</p>
                    <p className="text-sm font-bold text-landing-primary font-mono mt-0.5">00:{currentStep * 10 < 10 ? `0${currentStep * 10}` : currentStep * 10}</p>
                  </div>
                  <div className="h-6 w-px bg-landing-divider/40" />
                  <div>
                    <p className="text-[9px] font-bold text-landing-muted uppercase tracking-widest">Node State</p>
                    <p className={`text-sm font-black mt-0.5 ${isComplete ? 'text-landing-accentLime' : 'text-landing-accent'}`}>
                      {isComplete ? 'ACTIVE_LISTING' : 'ORCHESTRATING'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleReset} 
                    className="btn-proper-secondary text-[11px] py-2"
                  >
                    Reset Run
                  </button>
                  <button 
                    disabled={!isComplete}
                    className={`btn-proper-primary text-[11px] py-2 px-5 ${
                      !isComplete && 'opacity-40 cursor-not-allowed bg-landing-elevated text-landing-muted border-landing-divider'
                    }`}
                  >
                    {isComplete ? 'Launch Live Store' : 'Syncing pipeline...'}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
