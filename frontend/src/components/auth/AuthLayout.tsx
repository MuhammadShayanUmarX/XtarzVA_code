import { ReactNode, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { Logo3DSmall } from '../ui/Logo3D'
import { Activity, ShieldCheck, Zap, Globe, Cpu, Brain, Terminal } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
  reverse?: boolean
  panelState: 'researching' | 'completed'
}

const TESTIMONIALS = [
  {
    quote: "XtarzVA replaced our entire research team. We've launched 4 winners in 2 weeks.",
    name: "Alex Rivera",
    role: "DTC Founder",
    avatar: "A"
  },
  {
    quote: "The margin accuracy is insane. Saved us thousands in wasted ad spend.",
    name: "Sarah Chen",
    role: "E-com Strategist",
    avatar: "S"
  },
  {
    quote: "The only platform that actually understands TikTok Shop velocity.",
    name: "Mike Ross",
    role: "Shopify Partner",
    avatar: "M"
  }
]

export default function AuthLayout({ children, reverse = false, panelState }: AuthLayoutProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={cn("min-h-screen w-full flex flex-col md:flex-row bg-brand-950", reverse && "md:flex-row-reverse")}>
      
      {/* Cinematic Decorative Panel */}
      <section className={cn(
        "hidden md:flex relative overflow-hidden bg-brand-900 border-x border-white/5 flex-col justify-between p-16 transition-all duration-500",
        reverse ? "w-[60%]" : "w-[42%]"
      )}>
        {/* Background Atmosphere */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-violet/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 relative z-10 group">
          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all">
             <Logo3DSmall className="w-8 h-8" />
          </div>
          <span className="text-white font-black text-2xl tracking-tighter">XtarzVA</span>
        </Link>

        {/* Center: System Status */}
        <div className="relative flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-12">
           <div className="relative w-full flex flex-col pt-8 pb-4">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Scale your store. <br />
                <span className="text-accent-primary">Outsmart the competition.</span>
              </h2>
           </div>

           <div className="space-y-6 relative">
              <p className="text-[10px] font-black text-brand-700 uppercase tracking-[0.2em] mb-4 text-center">System Initialization</p>
              {[
                { name: 'Secure Connection', progress: panelState === 'completed' ? 100 : 72, color: 'cyan', icon: Globe },
                { name: 'Account Provisioning', progress: panelState === 'completed' ? 100 : 45, color: 'emerald', icon: ShieldCheck },
                { name: 'Workspace Setup', progress: panelState === 'completed' ? 100 : 15, color: 'violet', icon: Cpu }
              ].map((agent, i) => (
                <div key={agent.name} className="space-y-2 opacity-90 group cursor-default">
                   <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-brand-500 group-hover:text-brand-300 transition-colors">
                      <div className="flex items-center gap-2">
                         <agent.icon size={12} className={cn(`text-accent-${agent.color}`)} />
                         <span>{agent.name}</span>
                      </div>
                      <span className={cn(
                        agent.progress === 100 ? "text-accent-emerald" : 
                        agent.progress > 0 ? "text-accent-cyan" : "text-brand-700"
                      )}>
                        {agent.progress}%
                      </span>
                   </div>
                   <div className="h-1.5 bg-brand-800/50 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${agent.progress}%` }}
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                        className={cn("h-full rounded-full shadow-glow", `bg-accent-${agent.color}`)}
                      />
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Bottom: Social Proof & System Status */}
        <div className="relative z-10 w-full max-w-sm mx-auto space-y-8">
           <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: 'circOut' }}
                className="space-y-6"
              >
                <p className="text-lg text-white font-medium leading-relaxed italic tracking-tight">
                  "{TESTIMONIALS[currentTestimonial]?.quote}"
                </p>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-accent-primary font-black text-xs">
                      {TESTIMONIALS[currentTestimonial]?.avatar}
                   </div>
                   <div className="space-y-0.5">
                      <p className="text-sm font-black text-white">{TESTIMONIALS[currentTestimonial]?.name}</p>
                      <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{TESTIMONIALS[currentTestimonial]?.role}</p>
                   </div>
                </div>
              </motion.div>
           </AnimatePresence>
           
           <div className="flex items-center justify-between pt-8 border-t border-white/5">
              <div className="flex gap-2">
                 {TESTIMONIALS.map((_, i) => (
                   <div 
                     key={i} 
                     className={cn(
                       "h-1 transition-all duration-500 rounded-full",
                       i === currentTestimonial ? "bg-accent-primary w-8 shadow-glow" : "bg-brand-800 w-3"
                     )} 
                   />
                 ))}
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-medium text-brand-500">© 2026 XtarzVA</span>
              </div>
           </div>
        </div>
      </section>

      {/* Form Area */}
      <section className={cn(
        "flex-1 min-h-screen bg-brand-950 flex items-center justify-center p-8 sm:p-24 transition-all duration-500 relative",
        reverse ? "md:w-[40%]" : "md:w-[58%]"
      )}>
        {/* Subtle Background Light */}
        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-accent-primary/5 blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-[420px] mx-auto relative z-10">
          {children}
        </div>
      </section>

    </div>
  )
}
