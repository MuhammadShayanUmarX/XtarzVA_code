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
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password cannot exceed 72 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  shopifyUrl: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, 'You must agree to the terms')
})

type SignupFormValues = z.infer<typeof signupSchema>

const PasswordSecurity = ({ password }: { password: string }) => {
  if (!password) return null

  const requirements = [
    { label: "8 to 72 characters", met: password.length >= 8 && password.length <= 72 },
    { label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter (a-z)", met: /[a-z]/.test(password) },
    { label: "One number (0-9)", met: /[0-9]/.test(password) },
    { label: "One special character (e.g. !@#$%)", met: /[^A-Za-z0-9]/.test(password) },
  ]

  const strength = requirements.filter(r => r.met).length
  
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['bg-accent-rose', 'bg-accent-rose', 'bg-accent-amber', 'bg-accent-primary', 'bg-accent-emerald']
  const textColors = ['text-accent-rose', 'text-accent-rose', 'text-accent-amber', 'text-accent-primary', 'text-accent-emerald']

  return (
    <div className="mt-3 space-y-3">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Strength</span>
          <span className={cn("text-[10px] font-black uppercase tracking-widest", strength > 0 ? textColors[strength - 1] : "text-brand-600")}>
            {strength > 0 ? labels[strength - 1] : "Very Weak"}
          </span>
        </div>
        <div className="flex gap-1 h-1.5 bg-brand-900 rounded-full overflow-hidden p-[1px] border border-white/5">
          {[1, 2, 3, 4, 5].map(i => (
            <div 
              key={i} 
              className={cn(
                "h-full flex-1 rounded-full bg-transparent transition-all duration-300",
                i <= strength && colors[strength - 1]
              )} 
            />
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1.5">
        <p className="text-[9px] font-black text-brand-500 uppercase tracking-wider mb-1">Password Security Parameters</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                req.met ? "bg-accent-emerald shadow-[0_0_6px_rgba(16,185,129,0.6)]" : "bg-brand-850"
              )} />
              <span className={cn(
                "text-[10px] font-bold transition-all duration-300",
                req.met ? "text-brand-300" : "text-brand-600"
              )}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
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
    mode: 'onBlur'
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
        shopifyUrl: data.shopifyUrl || null
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
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Create your account</h1>
          <p className="text-sm text-brand-400">Start your 14-day free trial. No card required.</p>
        </header>

        {/* Social Auth */}
        <button className="w-full h-11 flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-all">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4">
           <div className="h-px flex-1 bg-white/5" />
           <span className="text-xs text-brand-600 font-medium uppercase tracking-widest">or</span>
           <div className="h-px flex-1 bg-white/5" />
        </div>

        {/* Global Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div 
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -10 }}
               className="p-4 bg-accent-rose/10 border border-accent-rose/20 rounded-lg flex items-start gap-3"
            >
               <AlertCircle className="w-5 h-5 text-accent-rose flex-shrink-0 mt-0.5" />
               <p className="text-xs font-black text-accent-rose leading-tight">
                 {error}
               </p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
           {/* Full Name */}
           <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-brand-200">Full name</label>
              <input 
                {...register('fullName')}
                placeholder="John Doe"
                className={cn(
                  "w-full h-11 bg-white/5 border border-white/10 rounded-lg px-3.5 text-sm text-white placeholder-brand-700 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20 transition-all",
                  errors.fullName && "border-accent-rose focus:border-accent-rose focus:ring-accent-rose/20"
                )}
              />
              {errors.fullName && <p className="text-[12px] text-accent-rose font-medium mt-1">{errors.fullName.message}</p>}
           </div>

           {/* Email */}
           <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-brand-200">Email address</label>
              <input 
                {...register('email')}
                type="email"
                placeholder="john@example.com"
                className={cn(
                  "w-full h-11 bg-white/5 border border-white/10 rounded-lg px-3.5 text-sm text-white placeholder-brand-700 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20 transition-all",
                  errors.email && "border-accent-rose focus:border-accent-rose focus:ring-accent-rose/20"
                )}
              />
              {errors.email && <p className="text-[12px] text-accent-rose font-medium mt-1">{errors.email.message}</p>}
           </div>

           {/* Password */}
           <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <label className="text-[13px] font-medium text-brand-200">Password</label>
                <span className="text-[11px] text-brand-700 font-medium">Must be 8-72 characters</span>
              </div>
              <div className="relative">
                <input 
                  {...register('password')}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn(
                    "w-full h-11 bg-white/5 border border-white/10 rounded-lg px-3.5 text-sm text-white placeholder-brand-700 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20 transition-all pr-11",
                    errors.password && "border-accent-rose focus:border-accent-rose focus:ring-accent-rose/20"
                  )}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-600 hover:text-brand-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <PasswordSecurity password={passwordValue} />
              {errors.password && <p className="text-[12px] text-accent-rose font-medium mt-1">{errors.password.message}</p>}
           </div>

           {/* Shopify URL */}
           <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-brand-200">Shopify Store URL (optional)</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-700 text-sm select-none">https://</div>
                <input 
                  {...register('shopifyUrl')}
                  placeholder="your-store.myshopify.com"
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-lg pl-[68px] pr-3.5 text-sm text-white placeholder-brand-700 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20 transition-all font-medium"
                />
              </div>
              <p className="text-[11px] text-brand-600 font-medium italic">You can also connect after signup</p>
           </div>

           {/* Terms */}
           <div className="flex items-start gap-3 py-2">
              <input 
                type="checkbox"
                {...register('agreeTerms')}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-accent-primary focus:ring-accent-primary mt-0.5 cursor-pointer accent-accent-primary"
              />
              <label className="text-xs text-brand-400 leading-tight select-none cursor-pointer">
                I agree to XtarzVA's <Link to="/terms" className="text-brand-50 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-brand-50 hover:underline">Privacy Policy</Link>
              </label>
           </div>
           {errors.agreeTerms && <p className="text-[11px] text-accent-rose font-medium -mt-1">{errors.agreeTerms.message}</p>}

           {/* Submit */}
           <button 
              type="submit"
              disabled={isSubmitting || !isValid}
              className={cn(
                "w-full h-11 rounded-lg font-bold text-sm text-white transition-all duration-300 relative overflow-hidden group",
                isSubmitting ? "bg-brand-900 cursor-not-allowed" : 
                isSuccess ? "bg-accent-emerald" : 
                isValid ? "bg-accent-primary hover:bg-accent-primary/90" : "bg-brand-900 text-brand-700 cursor-not-allowed"
              )}
           >
              <AnimatePresence mode="wait">
                 {isSubmitting ? (
                   <motion.div key="submitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Signing up...
                   </motion.div>
                 ) : isSuccess ? (
                   <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2">
                      <CheckCircle2 size={18} />
                      Success
                   </motion.div>
                 ) : (
                   <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-1">
                      Create Account
                      <span className="transition-transform group-hover:translate-x-1 duration-300">→</span>
                   </motion.div>
                 )}
              </AnimatePresence>
           </button>
        </form>

        <footer className="text-center pt-4">
           <p className="text-sm text-brand-400">
             Already have an account? <Link to="/auth/login" className="text-accent-primary font-bold hover:underline">Sign in →</Link>
           </p>
        </footer>
      </div>
    </AuthLayout>
  )
}
