import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface RunProgressOrbProps {
 progress: number // 0 to 100
 size?: number
 strokeWidth?: number
}

export default function RunProgressOrb({ 
 progress, 
 size = 120, 
 strokeWidth = 8 
}: RunProgressOrbProps) {
 const radius = (size - strokeWidth) / 2
 const circumference = radius * 2 * Math.PI
 const offset = circumference - (progress / 100) * circumference
 const isComplete = progress >= 100

 return (
 <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
 <svg className="rotate-[-90deg]" width={size} height={size}>
 {/* Background Ring */}
 <circle
 cx={size / 2}
 cy={size / 2}
 r={radius}
 stroke="currentColor"
 strokeWidth={strokeWidth}
 fill="transparent"
 className="text-landing-muted"
 />
 {/* Progress Ring */}
 <motion.circle
 cx={size / 2}
 cy={size / 2}
 r={radius}
 stroke={isComplete ? '#10b981' : 'url(#orbGradient)'}
 strokeWidth={strokeWidth}
 fill="transparent"
 strokeDasharray={circumference}
 initial={{ strokeDashoffset: circumference }}
 animate={{ strokeDashoffset: offset }}
 transition={{ duration: 1.5, ease: 'easeOut' }}
 strokeLinecap="round"
 />
 <defs>
 <linearGradient id="orbGradient" x1="0%" y1="0%" x2="100%" y2="0%">
 <stop offset="0%" stopColor="#3b82f6" />
 <stop offset="100%" stopColor="#06b6d4" />
 </linearGradient>
 </defs>
 </svg>
 
 {/* Center Content */}
 <div className="absolute inset-0 flex flex-col items-center justify-center">
 <AnimatePresence mode="wait">
 {isComplete ? (
 <motion.div 
 key="complete"
 initial={{ scale: 0, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 className="text-emerald-500"
 >
 <CheckCircle2 size={size * 0.4} />
 </motion.div>
 ) : (
 <motion.div 
 key="progress"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="text-center"
 >
 <p className="text-white font-bold leading-none" style={{ fontSize: size * 0.2 }}>
 {Math.round(progress)}%
 </p>
 <p className="text-landing-muted font-bold tracking-tight mt-1" style={{ fontSize: size * 0.08 }}>
 Complete
 </p>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* Glow for complete state */}
 {isComplete && (
 <motion.div 
 initial={{ opacity: 0, scale: 0.8 }}
 animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.2, 1.4] }}
 transition={{ duration: 1, repeat: 1 }}
 className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl pointer-events-none"
 />
 )}
 </div>
 )
}
