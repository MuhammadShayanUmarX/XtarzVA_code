import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { XtarzLogo } from '../../components/ui/XtarzLogo'

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
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setStep(2)
  }

  const handleResend = () => {
    setCooldown(60)
  }

  return (
    <div className="min-h-screen bg-landing-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex justify-center">
          <Link to="/">
            <XtarzLogo />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="landing-card p-8"
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="space-y-6"
              >
                <Link
                  to="/auth/login"
                  className="inline-flex items-center gap-2 text-sm text-landing-secondary hover:text-landing-primary transition-colors group"
                >
                  <ArrowLeft size={16} strokeWidth={1.5} className="group-hover:-translate-x-0.5 transition-transform" />
                  Back to sign in
                </Link>

                <div className="space-y-2">
                  <h1 className="text-2xl font-semibold text-landing-primary tracking-tight">
                    Reset your password
                  </h1>
                  <p className="text-sm text-landing-secondary">We&apos;ll send a reset link to your inbox.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <label className="auth-label">Email address</label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="you@example.com"
                      className={cn('auth-input', errors.email && 'border-rose-500/50')}
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-400">{errors.email.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      'w-full btn-proper-primary h-12 justify-center',
                      isSubmitting && 'opacity-70 cursor-not-allowed'
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" strokeWidth={1.5} />
                        Sending link...
                      </>
                    ) : (
                      'Send reset link'
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="text-center space-y-6"
              >
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-landing-accentLime/10 flex items-center justify-center text-landing-accentLime border border-landing-accentLime/20">
                    <CheckCircle2 size={28} strokeWidth={1.5} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-landing-primary tracking-tight">Check your inbox</h2>
                  <p className="text-sm text-landing-secondary">
                    We sent a reset link to{' '}
                    <span className="text-landing-primary font-medium">{email}</span>.
                    If you don&apos;t see it, check your spam folder.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Link
                    to="/auth/login"
                    className="w-full btn-proper-secondary h-12 justify-center flex items-center"
                  >
                    Back to sign in
                  </Link>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0}
                    className={cn(
                      'text-sm font-medium transition-colors',
                      cooldown > 0
                        ? 'text-landing-muted cursor-not-allowed'
                        : 'text-landing-accent hover:text-landing-accentSoft'
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
    </div>
  )
}
