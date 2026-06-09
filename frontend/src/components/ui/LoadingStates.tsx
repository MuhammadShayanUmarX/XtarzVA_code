import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import Logo3D from './Logo3D'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("skeleton-shimmer", className)} />
  )
}

export function LoadingScreen() {
  return (
     <motion.div 
       initial={{ opacity: 1 }}
       exit={{ opacity: 0, scale: 1.05 }}
       transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
       className="fixed inset-0 z-[100] bg-brand-950 flex flex-col items-center justify-center overflow-hidden"
     >
        {/* Stellar Background elements */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
           <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full blur-[1px] animate-twinkle" />
           <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white rounded-full blur-[1px] animate-twinkle delay-700" />
        </div>

        {/* 3D Background & Logo */}
        <Logo3D />

        {/* Content Overlay */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center px-6"
        >
           <div className="pt-24 md:pt-32"> {/* Offset for the centered 3D Logo */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="text-4xl md:text-5xl font-bold text-white tracking-tighter"
              >
                XtarzVA
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="text-brand-300 mt-3 text-sm md:text-base tracking-[0.2em] uppercase font-medium"
              >
                Virtual Assistance, Stellar Results
              </motion.p>
           </div>
        </motion.div>

        {/* Progress Indicator */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 space-y-4">
           <div className="h-[2px] w-full bg-white/5 relative overflow-hidden rounded-full">
              <motion.div 
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-accent-primary to-transparent"
              />
           </div>
           <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px] text-white/40 uppercase tracking-widest text-center"
           >
              Initializing Systems
           </motion.p>
        </div>
     </motion.div>
  )
}

interface StaggerContainerProps {
  children: React.ReactNode
  delay?: number
  stagger?: number
  className?: string
}

export function StaggerContainer({ children, delay = 0, stagger = 0.05, className }: StaggerContainerProps) {
   return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
           hidden: { opacity: 0 },
           visible: {
              opacity: 1,
              transition: {
                 delayChildren: delay,
                 staggerChildren: stagger
              }
           }
        }}
        className={className}
      >
         {children}
      </motion.div>
   )
}

export const staggerItem = {
   hidden: { opacity: 0, y: 8 },
   visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
}
