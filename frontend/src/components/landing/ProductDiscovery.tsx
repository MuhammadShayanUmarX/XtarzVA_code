import { Search, TrendingUp, BarChart3, Target, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const ICON = { strokeWidth: 1.5 as const }

const BENEFITS = [
  {
    icon: Search,
    title: 'Spot trending products early',
    description: 'See what\'s gaining momentum on TikTok, social media, and search — before everyone else jumps in.',
  },
  {
    icon: TrendingUp,
    title: 'Know the demand instantly',
    description: 'Get a clear score showing how much real buyer interest exists, so you never waste time on dead-end products.',
  },
  {
    icon: BarChart3,
    title: 'See if you can actually compete',
    description: 'Understand how crowded the market is and whether there\'s room for you to win.',
  },
  {
    icon: Target,
    title: 'Get a ready-made game plan',
    description: 'Receive a clear summary of who to sell to, what angle to market, and why this product will work.',
  },
]

export default function ProductDiscovery() {
  return (
    <section id="features" className="py-24 bg-landing-bg border-t border-landing-divider">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="section-eyebrow">Product research</span>
          <h2 className="text-3xl md:text-4xl font-semibold text-landing-primary tracking-tight leading-tight">
            Find your next bestseller{' '}
            <br className="hidden md:block" />
            in minutes, not weeks.
          </h2>
          <p className="text-landing-secondary text-lg">
            Uncover products that are actually selling right now, backed by research you can act on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((benefit, i) => (
            <div key={i} className="p-6 landing-card">
              <div className="w-10 h-10 rounded-lg bg-landing-accent/10 flex items-center justify-center mb-5">
                <benefit.icon className="w-5 h-5 text-landing-accent" {...ICON} />
              </div>
              <h3 className="text-base font-semibold text-landing-primary mb-2">{benefit.title}</h3>
              <p className="text-sm text-landing-secondary leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 landing-panel overflow-hidden">
          <div className="px-6 py-4 border-b border-landing-divider flex items-center justify-between bg-landing-elevated">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-landing-accent" strokeWidth={1.5} />
              <span className="text-sm font-medium text-landing-primary">Example result</span>
            </div>
            <span className="text-xs font-medium metric-up">High opportunity</span>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-landing-muted mb-1">Product</p>
              <p className="text-lg font-semibold text-landing-primary">Smart Posture Brace</p>
            </div>
            <div>
              <p className="text-xs text-landing-muted mb-1">Demand</p>
              <p className="text-lg font-semibold metric-up">84 / 100</p>
            </div>
            <div>
              <p className="text-xs text-landing-muted mb-1">Competition</p>
              <p className="text-lg font-semibold text-landing-secondary">Medium</p>
            </div>
            <div>
              <p className="text-xs text-landing-muted mb-1">Insight</p>
              <p className="text-sm text-landing-secondary">High search volume from office workers. Market with a back-pain-relief angle.</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link to="/auth/signup" className="btn-proper-primary inline-flex">
            Start researching products
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  )
}
