import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<{ email: string }>({
    resolver: zodResolver(schema),
  })

  const email = watch('email')

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const onSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setStep(2)
  }

  const handleResend = () => {
    setCooldown(60)
    // Simulate resend logic
  }

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] bg-brand-900/50 border border-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <Link to="/auth/login" className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-white transition-colors mb-4 group">
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                Back to login
              </Link>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Reset your password</h1>
                <p className="text-sm text-brand-400">We'll send a reset link to your inbox.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-brand-200">Email address</label>
                  <div className="relative">
                    <input 
                      {...register('email')}
                      type="email"
                      placeholder="john@example.com"
                      className={cn(
                        "w-full h-11 bg-white/5 border border-white/10 rounded-lg px-3.5 text-sm text-white placeholder-brand-700 focus:outline-none focus:border-accent-primary transition-all",
                        errors.email && "border-accent-rose"
                      )}
                    />
                  </div>
                  {errors.email && <p className="text-[12px] text-accent-rose font-medium mt-1">{errors.email.message}</p>}
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full h-11 rounded-lg bg-gradient-cta font-bold text-sm text-white shadow-glow hover:brightness-110 transition-all flex items-center justify-center gap-2",
                    isSubmitting && "bg-brand-900 cursor-not-allowed opacity-50"
                  )}
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {isSubmitting ? 'Sending link...' : 'Send reset link'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: 'spring', damping: 12 }}
                   className="w-16 h-16 rounded-full bg-accent-emerald/10 flex items-center justify-center text-accent-emerald border border-accent-emerald/20"
                 >
                    <CheckCircle2 size={32} />
                 </motion.div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Check your inbox</h2>
                <p className="text-sm text-brand-400">
                  We sent a reset link to <span className="text-white font-medium">{email}</span>. <br />
                  If you don't see it, check your spam folder.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <Link to="/auth/login" className="w-full h-11 rounded-lg bg-white/5 border border-white/10 font-bold text-sm text-white hover:bg-white/10 transition-all flex items-center justify-center">
                   Back to login
                </Link>
                <button 
                  onClick={handleResend}
                  disabled={cooldown > 0}
                  className={cn(
                    "text-xs font-bold transition-colors",
                    cooldown > 0 ? "text-brand-600 cursor-not-allowed" : "text-accent-primary hover:underline"
                  )}
                >
                  {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend email'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
