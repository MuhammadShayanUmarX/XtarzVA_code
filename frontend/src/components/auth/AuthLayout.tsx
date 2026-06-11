import { ReactNode, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { XtarzLogo } from '../ui/XtarzLogo'
import { ShieldCheck, TrendingUp, Store } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
  reverse?: boolean
  panelState?: 'researching' | 'completed'
}

const TESTIMONIALS = [
  {
    quote: 'XtarzVA replaced weeks of product research. We launched four winners in two weeks.',
    name: 'Alex Rivera',
    role: 'DTC founder',
    avatar: 'A',
  },
  {
    quote: 'The margin breakdown saved us from a product that looked great but would have lost money.',
    name: 'Sarah Chen',
    role: 'E-commerce strategist',
    avatar: 'S',
  },
  {
    quote: 'Finally one workflow from research to uploadable Shopify theme.',
    name: 'Mike Ross',
    role: 'Shopify partner',
    avatar: 'M',
  },
]

const HIGHLIGHTS = [
  { icon: TrendingUp, label: 'Product research & demand scores' },
  { icon: ShieldCheck, label: 'Margin validation before ad spend' },
  { icon: Store, label: 'Uploadable Shopify OS 2.0 themes' },
]

export default function AuthLayout({ children, reverse = false }: AuthLayoutProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className={cn(
        'min-h-screen w-full flex flex-col md:flex-row bg-landing-bg font-sans',
        reverse && 'md:flex-row-reverse'
      )}
    >
      <section
        className={cn(
          'hidden md:flex relative overflow-hidden bg-landing-surface border-landing-divider flex-col justify-between p-12 lg:p-16',
          reverse ? 'md:w-[45%] border-l' : 'md:w-[42%] border-r'
        )}
      >
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none opacity-60" />

        <Link to="/" className="relative z-10">
          <XtarzLogo />
        </Link>

        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-md space-y-10 py-12">
          <div>
            <h2 className="text-2xl lg:text-3xl font-semibold text-landing-primary tracking-tight leading-tight">
              Scale your store.{' '}
              <span className="text-landing-accent">Know before you launch.</span>
            </h2>
            <p className="text-sm text-landing-secondary mt-4 leading-relaxed">
              Research products, validate margins, and ship a premium storefront — in one platform.
            </p>
          </div>

          <ul className="space-y-4">
            {HIGHLIGHTS.map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-sm text-landing-secondary">
                <div className="w-9 h-9 rounded-lg bg-landing-accent/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-landing-accent" strokeWidth={1.5} />
                </div>
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="landing-card p-6"
            >
              <p className="text-sm text-landing-primary leading-relaxed">
                &quot;{TESTIMONIALS[currentTestimonial]?.quote}&quot;
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-9 h-9 rounded-lg bg-landing-accent/10 border border-landing-accent/20 flex items-center justify-center text-xs font-semibold text-landing-accent">
                  {TESTIMONIALS[currentTestimonial]?.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-landing-primary">
                    {TESTIMONIALS[currentTestimonial]?.name}
                  </p>
                  <p className="text-xs text-landing-muted">
                    {TESTIMONIALS[currentTestimonial]?.role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {TESTIMONIALS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    i === currentTestimonial ? 'bg-landing-accent w-6' : 'bg-landing-divider w-2'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-landing-muted">© 2026 XtarzVA</span>
          </div>
        </div>
      </section>

      <section className="flex-1 min-h-screen flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-[420px] mx-auto">
          <div className="md:hidden mb-8">
            <Link to="/">
              <XtarzLogo />
            </Link>
          </div>
          {children}
        </div>
      </section>
    </div>
  )
}
