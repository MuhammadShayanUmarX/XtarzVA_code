import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ChevronRight, Key, Mail } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import { useSession } from '../../store/session'
import { cn } from '../../lib/utils'
import api from '../../lib/api'
import { getApiErrorMessage } from '../../lib/apiErrors'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
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
    mode: 'onBlur'
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await api.post('/v2/auth/login', {
        email: data.email,
        password: data.password
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
      <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
        <header className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-8 bg-accent-primary rounded-full shadow-glow" />
             <h1 className="text-4xl font-black text-brand-50 tracking-tight">Welcome Back.</h1>
          </div>
          <p className="text-lg text-brand-400 font-medium">Sign in to your account to continue.</p>
        </header>

        {/* Global Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div 
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -10 }}
               className="p-5 bg-accent-rose/10 border border-accent-rose/20 rounded-2xl flex items-start gap-4"
            >
               <AlertCircle className="w-6 h-6 text-accent-rose flex-shrink-0 mt-0.5" />
               <p className="text-sm font-black text-accent-rose leading-tight">
                 {error}
               </p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
           {/* Email */}
           <div className="space-y-3">
              <label className="text-[13px] font-medium text-brand-200 px-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-700 group-focus-within:text-accent-primary transition-colors">
                   <Mail size={18} />
                </div>
                <input 
                  {...register('email')}
                  type="email"
                  placeholder="john@example.com"
                  className={cn(
                    "w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-6 text-sm text-brand-50 placeholder-brand-800 focus:outline-none focus:border-accent-primary/40 transition-all font-bold",
                    errors.email && "border-accent-rose/40 focus:border-accent-rose/40"
                  )}
                />
              </div>
              {errors.email && <p className="text-[11px] text-accent-rose font-black uppercase tracking-widest px-1">{errors.email.message}</p>}
           </div>

           {/* Password */}
           <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[13px] font-medium text-brand-200 px-1">Password</label>
                <Link to="/auth/forgot-password" className="text-[12px] font-medium text-brand-400 hover:text-white transition-colors">
                   Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-700 group-focus-within:text-accent-primary transition-colors">
                   <Key size={18} />
                </div>
                <input 
                  {...register('password')}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className={cn(
                    "w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-14 text-sm text-brand-50 placeholder-brand-800 focus:outline-none focus:border-accent-primary/40 transition-all font-bold",
                    errors.password && "border-accent-rose/40 focus:border-accent-rose/40"
                  )}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-accent-rose font-black uppercase tracking-widest px-1">{errors.password.message}</p>}
           </div>

           {/* Submit */}
           <button 
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full h-16 rounded-2xl font-black text-sm text-white transition-all duration-300 relative overflow-hidden group flex items-center justify-center gap-3",
                isSubmitting ? "bg-brand-900 cursor-not-allowed border border-white/5" :
                "bg-accent-primary hover:bg-accent-primary/90 active:scale-95"
              )}
           >
              <AnimatePresence mode="wait">
                 {isSubmitting ? (
                   <motion.div key="submitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 font-bold text-base">
                      <Loader2 size={18} className="animate-spin text-white" />
                      Signing in...
                   </motion.div>
                 ) : (
                   <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 font-bold text-base">
                      Sign In
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                   </motion.div>
                 )}
              </AnimatePresence>
           </button>
        </form>

        <footer className="pt-4 text-center">
           <p className="text-sm text-brand-400">
             Don't have an account? <Link to="/auth/signup" className="text-accent-primary font-bold hover:underline transition-colors">Sign up →</Link>
           </p>
        </footer>
      </div>
    </AuthLayout>
  )
}
