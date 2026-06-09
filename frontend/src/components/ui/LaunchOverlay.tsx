import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

interface LaunchOverlayProps {
  isLaunching: boolean
}

export default function LaunchOverlay({ isLaunching }: LaunchOverlayProps) {
  if (!isLaunching) return null

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-brand-950 flex items-center justify-center p-8 overflow-hidden"
    >
      <div className="absolute inset-0 mesh-bg opacity-30" />
      <div className="relative z-10 text-center space-y-12 max-w-lg w-full">
         <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-24 h-24 mx-auto rounded-[32px] bg-accent-primary/20 border border-accent-primary/40 flex items-center justify-center shadow-[0_0_80px_rgba(79,110,247,0.4)]"
         >
            <Zap className="w-10 h-10 text-accent-primary fill-current animate-pulse" />
         </motion.div>
         
         <div className="space-y-4">
            <h2 className="text-3xl font-black text-white tracking-tighter">Starting AI Scan...</h2>
            <div className="space-y-2">
               <p className="text-sm font-mono text-accent-cyan">Initializing node: US-EAST-1</p>
               <p className="text-sm font-mono text-brand-600">Powering up intelligence engines...</p>
            </div>
         </div>

         <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="h-full bg-gradient-cta shadow-[0_0_20px_rgba(79,110,247,0.6)]"
            />
         </div>

         <div className="flex justify-center gap-8">
            {['PRODUCT', 'COMPETITOR', 'CREATION', 'DEPLOYMENT'].map((agent, i) => (
              <motion.div 
                key={agent}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (i * 0.3) }}
                className="text-[9px] font-black text-brand-500 tracking-widest uppercase"
              >
                 {agent} <br /> 
                 <span className="text-accent-emerald">READY</span>
              </motion.div>
            ))}
         </div>
      </div>
    </motion.div>
  )
}
