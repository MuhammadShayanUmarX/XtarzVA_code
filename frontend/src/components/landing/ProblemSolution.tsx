import { XCircle, CheckCircle2, ArrowRight, Clock, DollarSign, BarChart3, Zap, TrendingUp, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const ICON = { strokeWidth: 1.5 as const, className: 'w-5 h-5' }

const PAIN_POINTS = [
  {
    icon: Clock,
    title: 'Hours lost on research',
    description: 'Scrolling through AliExpress, TikTok, and competitor stores trying to find a product worth selling.',
  },
  {
    icon: DollarSign,
    title: 'Money wasted on bad products',
    description: 'Launching products that looked promising but had terrible margins or were already oversaturated.',
  },
  {
    icon: BarChart3,
    title: 'Guessing instead of knowing',
    description: 'No real data on what\'s trending, what competitors charge, or whether your margins will actually work.',
  },
]

const OUTCOMES = [
  {
    icon: Zap,
    title: 'Find winners in minutes',
    description: 'Get validated product ideas backed by real demand signals, not hunches.',
  },
  {
    icon: TrendingUp,
    title: 'Launch with confidence',
    description: 'Know your margins, competitors, and target audience before you spend a dollar.',
  },
  {
    icon: ShieldCheck,
    title: 'Ready for Shopify',
    description: 'Download an uploadable theme ZIP, product copy, and import files — publish when you are ready.',
  },
]

export default function ProblemSolution() {
  return (
    <section id="why-xtarz" className="py-24 bg-landing-bg border-t border-landing-divider">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-landing-primary tracking-tight leading-tight">
            You didn&apos;t start a business{' '}
            <br className="hidden md:block" />
            to spend all day <span className="text-landing-accent">researching.</span>
          </h2>
          <p className="text-base md:text-lg text-landing-secondary max-w-2xl mx-auto mt-4">
            Most sellers waste weeks on product research, competitor analysis, and store setup. XtarzVA turns that into a focused workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="p-8 md:p-10 landing-card flex flex-col space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-landing-divider">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <XCircle {...ICON} className="w-4 h-4 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-landing-primary">The old way</h3>
                <p className="text-sm text-landing-muted">Slow, expensive, and full of guesswork</p>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              {PAIN_POINTS.map((point, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-landing-elevated border border-landing-divider flex items-center justify-center">
                    <point.icon {...ICON} className="w-5 h-5 text-landing-muted" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-landing-primary mb-1">{point.title}</h4>
                    <p className="text-sm text-landing-secondary leading-relaxed">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-landing-elevated border border-landing-divider rounded-lg flex justify-between items-center text-sm">
              <span className="text-landing-secondary font-medium">Typical time per product:</span>
              <span className="font-semibold text-rose-400">18+ hours</span>
            </div>
          </div>

          <div className="p-8 md:p-10 landing-card border-landing-accent/30 flex flex-col space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-landing-divider">
              <div className="w-9 h-9 rounded-lg bg-landing-accentLime/10 border border-landing-accentLime/20 flex items-center justify-center">
                <CheckCircle2 {...ICON} className="w-4 h-4 text-landing-accentLime" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-landing-primary">The XtarzVA way</h3>
                <p className="text-sm text-landing-accent">Fast, data-backed, and ready to sell</p>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              {OUTCOMES.map((outcome, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-landing-accent/10 border border-landing-accent/20 flex items-center justify-center">
                    <outcome.icon {...ICON} className="w-5 h-5 text-landing-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-landing-primary mb-1">{outcome.title}</h4>
                    <p className="text-sm text-landing-secondary leading-relaxed">{outcome.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-landing-elevated border border-landing-divider rounded-lg flex justify-between items-center text-sm">
              <span className="text-landing-secondary font-medium">With XtarzVA:</span>
              <span className="font-semibold metric-up">Under 30 minutes</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/auth/signup" className="btn-proper-primary inline-flex">
            Start saving time
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  )
}
