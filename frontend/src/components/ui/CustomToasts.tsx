import { motion, AnimatePresence } from 'framer-motion'
import { toast, Toaster } from 'react-hot-toast'
import { X, CheckCircle2, AlertCircle, Info, ShieldAlert, Cpu, Zap, Activity } from 'lucide-react'
import { cn } from '../../lib/utils'

export function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={16}
      containerStyle={{ top: 32, right: 32 }}
      toastOptions={{
        duration: 5000,
        style: {
          background: 'transparent',
          color: '#fff',
          boxShadow: 'none',
          padding: 0,
        },
      }}
    >
      {(t) => (
        <AnimatePresence>
          {t.visible && (
            <motion.div
              initial={{ x: 400, opacity: 0, filter: 'blur(10px)' }}
              animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ x: 400, opacity: 0, filter: 'blur(10px)' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative"
            >
               <ToastContent t={t} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </Toaster>
  )
}

function ToastContent({ t }: { t: any }) {
  const isSuccess = t.type === 'success'
  const isError = t.type === 'error'
  
  const icons = {
    success: <CheckCircle2 size={18} className="text-accent-emerald" />,
    error: <ShieldAlert size={18} className="text-accent-rose" />,
    loading: <Activity size={18} className="text-accent-amber animate-spin" />,
    blank: <Cpu size={18} className="text-accent-primary" />
  }

  const borderColors = {
    success: 'border-accent-emerald/20',
    error: 'border-accent-rose/20',
    loading: 'border-accent-amber/20',
    blank: 'border-accent-primary/20'
  }

  const accentColors = {
    success: 'bg-accent-emerald',
    error: 'bg-accent-rose',
    loading: 'bg-accent-amber',
    blank: 'bg-accent-primary'
  }

  const labels = {
    success: 'Protocol Success',
    error: 'Critical Alert',
    loading: 'Operation Pending',
    blank: 'System Message'
  }

  return (
    <div className={cn(
      "w-[360px] bg-brand-900 border backdrop-blur-3xl rounded-2xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.6)]",
      borderColors[t.type as keyof typeof borderColors] || borderColors.blank
    )}>
       <div className="p-5 flex items-start gap-4">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
            isSuccess ? "bg-accent-emerald/10 border-accent-emerald/20" : 
            isError ? "bg-accent-rose/10 border-accent-rose/20" : "bg-white/5 border-white/10"
          )}>
             {icons[t.type as keyof typeof icons] || icons.blank}
          </div>
          
          <div className="flex-1 min-w-0 pr-4">
             <div className="flex items-center gap-2 mb-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500">
                   {labels[t.type as keyof typeof labels] || labels.blank}
                </p>
                <div className="w-1 h-1 rounded-full bg-brand-700" />
                <span className="text-[9px] font-mono text-brand-700 uppercase">{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
             </div>
             <p className="text-sm font-bold text-white leading-tight">
                {t.message}
             </p>
          </div>

          <button 
            onClick={() => toast.dismiss(t.id)}
            className="text-brand-700 hover:text-white transition-colors"
          >
             <X size={16} />
          </button>
       </div>

       {/* Progress Timer Drain */}
       <div className="h-[3px] w-full bg-white/5 relative">
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: 0 }}
            transition={{ duration: 5, ease: "linear" }}
            className={cn(
              "h-full shadow-glow",
              accentColors[t.type as keyof typeof accentColors] || accentColors.blank
            )}
          />
       </div>
    </div>
  )
}
