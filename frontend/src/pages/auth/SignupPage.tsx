import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import { useSession } from '../../store/session'
import { cn } from '../../lib/utils'
import api from '../../lib/api'
import { getApiErrorMessage } from '../../lib/apiErrors'

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password cannot exceed 72 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  shopifyUrl: z.string().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
})

type SignupFormValues = z.infer<typeof signupSchema>

const PasswordSecurity = ({ password }: { password: string }) => {
  if (!password) return null

  const requirements = [
    { label: '8 to 72 characters', met: password.length >= 8 && password.length <= 72 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
  ]

  const strength = requirements.filter((r) => r.met).length
  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong']
  const barColors = [
    'bg-rose-500',
    'bg-rose-500',
    'bg-amber-500',
    'bg-landing-accentSoft',
    'bg-landing-accentLime',
  ]
  const textColors = [
    'text-rose-400',
    'text-rose-400',
    'text-amber-400',
    'text-landing-accentSoft',
    'text-landing-accentLime',
  ]

  return (
    <div className="mt-3 space-y-3">
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-landing-muted">Password strength</span>
          <span className={cn('text-xs font-medium', strength > 0 ? textColors[strength - 1] : 'text-landing-muted')}>
            {strength > 0 ? labels[strength - 1] : 'Very weak'}
          </span>
        </div>
        <div className="flex gap-1 h-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={cn(
                'h-full flex-1 rounded-full bg-landing-divider transition-colors',
                i <= strength && barColors[strength - 1]
              )}
            />
          ))}
        </div>
      </div>

      <div className="p-3 rounded-lg bg-landing-elevated border border-landing-divider space-y-1.5">
        {requirements.map((req) => (
          <div key={req.label} className="flex items-center gap-2">
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                req.met ? 'bg-landing-accentLime' : 'bg-landing-divider'
              )}
            />
            <span className={cn('text-xs', req.met ? 'text-landing-secondary' : 'text-landing-muted')}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { setTokens } = useSession()

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  })

  const passwordValue = watch('password', '')

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await api.post('/v2/auth/signup', {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        shopifyUrl: data.shopifyUrl || null,
      })

      const { access_token, refresh_token } = response.data
      setTokens(access_token, refresh_token)
      setIsSubmitting(false)
      setIsSuccess(true)
      setTimeout(() => navigate('/onboarding'), 1500)
    } catch (err: unknown) {
      setIsSubmitting(false)
      setError(getApiErrorMessage(err, 'Sign up failed. Please try again.'))
    }
  }

  return (
    <AuthLayout reverse panelState="researching">
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-landing-primary tracking-tight">Create your account</h1>
          <p className="text-landing-secondary">Start free. No credit card required.</p>
        </header>

        <button
          type="button"
          className="w-full h-12 flex items-center justify-center gap-3 bg-landing-elevated border border-landing-divider rounded-lg text-sm font-medium text-landing-primary hover:bg-landing-surface transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-landing-divider" />
          <span className="text-xs text-landing-muted">or</span>
          <div className="h-px flex-1 bg-landing-divider" />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" strokeWidth={1.5} />
              <p className="text-sm text-rose-400">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="auth-label">Full name</label>
            <input
              {...register('fullName')}
              placeholder="John Doe"
              className={cn('auth-input', errors.fullName && 'border-rose-500/50')}
            />
            {errors.fullName && <p className="text-xs text-rose-400">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="auth-label">Email address</label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className={cn('auth-input', errors.email && 'border-rose-500/50')}
            />
            {errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="auth-label">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={cn('auth-input pr-12', errors.password && 'border-rose-500/50')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-landing-muted hover:text-landing-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>
            <PasswordSecurity password={passwordValue} />
            {errors.password && <p className="text-xs text-rose-400">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="auth-label">Shopify store URL (optional)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-landing-muted text-sm select-none">
                https://
              </span>
              <input
                {...register('shopifyUrl')}
                placeholder="your-store.myshopify.com"
                className="auth-input pl-[4.5rem]"
              />
            </div>
            <p className="text-xs text-landing-muted">You can connect your store after signup.</p>
          </div>

          <div className="flex items-start gap-3 py-1">
            <input
              type="checkbox"
              {...register('agreeTerms')}
              className="w-4 h-4 rounded border-landing-divider bg-landing-elevated text-landing-accent focus:ring-landing-accent/30 mt-0.5 cursor-pointer accent-[#E07A3A]"
            />
            <label className="text-xs text-landing-secondary leading-relaxed cursor-pointer">
              I agree to XtarzVA&apos;s{' '}
              <Link to="/terms" className="text-landing-primary hover:text-landing-accent transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-landing-primary hover:text-landing-accent transition-colors">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.agreeTerms && <p className="text-xs text-rose-400">{errors.agreeTerms.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={cn(
              'w-full h-12 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2',
              isSuccess
                ? 'bg-landing-accentLime/20 text-landing-accentLime border border-landing-accentLime/30'
                : isValid
                  ? 'btn-proper-primary'
                  : 'bg-landing-elevated text-landing-muted border border-landing-divider cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" strokeWidth={1.5} />
                Creating account...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 size={18} strokeWidth={1.5} />
                Account created
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className="text-sm text-landing-secondary text-center">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-landing-accent font-medium hover:text-landing-accentSoft transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
