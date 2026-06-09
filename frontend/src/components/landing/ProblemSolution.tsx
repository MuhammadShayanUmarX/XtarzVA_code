import { XCircle, CheckCircle2, ArrowRight, Clock, DollarSign, Brain, Zap, TrendingUp, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

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
    icon: Brain,
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
    title: 'Go live on Shopify instantly',
    description: 'Product descriptions, images, pricing — everything pushed to your store, ready to sell.',
  },
]

export default function ProblemSolution() {
  return (
    <section id="why-xtarz" className="py-28 bg-landing-bg relative overflow-hidden border-t border-landing-divider/10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-landing-primary tracking-tightest mt-4 leading-tight">
            You didn't start a business <br className="hidden md:block" />
            to spend all day <span className="text-landing-accent">researching.</span>
          </h2>
          <p className="text-base md:text-lg text-landing-secondary max-w-2xl mx-auto mt-5">
            Most sellers waste weeks on product research, competitor analysis, and store setup. Xtarz turns that entire process into a few clicks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          
          {/* Left: The Pain */}
          <div className="p-8 md:p-10 landing-panel border border-landing-divider/20 flex flex-col space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-landing-divider/20">
              <div className="w-9 h-9 rounded bg-[#E57373]/10 border border-[#E57373]/20 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-[#E57373]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-landing-primary">The old way</h3>
                <p className="text-xs text-landing-muted">Slow, expensive, and full of guesswork</p>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              {PAIN_POINTS.map((point, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-[#E57373]/8 border border-[#E57373]/15 flex items-center justify-center">
                    <point.icon className="w-5 h-5 text-[#E57373]/70" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-landing-primary mb-1">{point.title}</h4>
                    <p className="text-sm text-landing-secondary leading-relaxed">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-landing-surface border border-landing-divider/25 rounded-lg flex justify-between items-center text-sm">
              <span className="text-landing-secondary font-semibold">Typical time per product:</span>
              <span className="font-bold text-[#E57373]">18+ hours</span>
            </div>
          </div>

          {/* Right: The Transformation */}
          <div className="p-8 md:p-10 landing-panel border border-landing-accent/30 shadow-2xl flex flex-col space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-landing-divider/20">
              <div className="w-9 h-9 rounded bg-landing-accentLime/10 border border-landing-accentLime/20 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-landing-accentLime" />
              </div>
              <div>
                <h3 className="text-base font-bold text-landing-primary">The Xtarz way</h3>
                <p className="text-xs text-landing-accent">Fast, data-backed, and ready to sell</p>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              {OUTCOMES.map((outcome, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-landing-accent/10 border border-landing-accent/20 flex items-center justify-center">
                    <outcome.icon className="w-5 h-5 text-landing-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-landing-primary mb-1">{outcome.title}</h4>
                    <p className="text-sm text-landing-secondary leading-relaxed">{outcome.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-landing-surface border border-landing-accent/20 rounded-lg flex justify-between items-center text-sm">
              <span className="text-landing-secondary font-semibold">With Xtarz:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-landing-accentLime">Under 5 minutes</span>
                <span className="px-2 py-0.5 rounded bg-landing-accentLime/10 border border-landing-accentLime/20 text-[10px] font-bold text-landing-accentLime uppercase">98% faster</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <Link to="/auth/signup" className="btn-proper-primary text-sm px-8 py-4 inline-flex">
            Start Saving Time
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

      </div>
    </section>
  )
}
