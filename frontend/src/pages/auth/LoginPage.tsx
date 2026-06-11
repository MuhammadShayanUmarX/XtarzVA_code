import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, AlertCircle, ChevronRight, Key, Mail } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import { useSession } from '../../store/session'
import { cn } from '../../lib/utils'
import api from '../../lib/api'
import { getApiErrorMessage } from '../../lib/apiErrors'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const { setTokens } = useSession()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await api.post('/v2/auth/login', {
        email: data.email,
        password: data.password,
      })

      const { access_token, refresh_token } = response.data
      setTokens(access_token, refresh_token)
      setIsSubmitting(false)
      navigate('/dashboard')
    } catch (err: unknown) {
      setIsSubmitting(false)
      setError(getApiErrorMessage(err, 'Sign in failed. Invalid credentials.'))
    }
  }

  return (
    <AuthLayout panelState="completed">
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-landing-primary tracking-tight">Welcome back</h1>
          <p className="text-landing-secondary">Sign in to continue to your dashboard.</p>
        </header>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" strokeWidth={1.5} />
              <p className="text-sm text-rose-400">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="auth-label">Email address</label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-landing-muted group-focus-within:text-landing-accent transition-colors"
                strokeWidth={1.5}
              />
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className={cn('auth-input-lg pl-12', errors.email && 'border-rose-500/50')}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="auth-label">Password</label>
              <Link
                to="/auth/forgot-password"
                className="text-xs text-landing-accent hover:text-landing-accentSoft transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <Key
                className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-landing-muted group-focus-within:text-landing-accent transition-colors"
                strokeWidth={1.5}
              />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={cn('auth-input-lg pl-12 pr-12', errors.password && 'border-rose-500/50')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-landing-muted hover:text-landing-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-400">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full btn-proper-primary h-14 justify-center text-base',
              isSubmitting && 'opacity-70 cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" strokeWidth={1.5} />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ChevronRight size={18} strokeWidth={1.5} />
              </>
            )}
          </button>
        </form>

        <p className="text-sm text-landing-secondary text-center">
          Don&apos;t have an account?{' '}
          <Link to="/auth/signup" className="text-landing-accent font-medium hover:text-landing-accentSoft transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
