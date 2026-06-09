import { Search, TrendingUp, BarChart3, Target, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const BENEFITS = [
  {
    icon: Search,
    title: 'Spot trending products early',
    description: 'See what\'s gaining momentum on TikTok, social media, and search engines — before everyone else jumps in.'
  },
  {
    icon: TrendingUp,
    title: 'Know the demand instantly',
    description: 'Get a clear score showing how much real buyer interest exists, so you never waste time on dead-end products.'
  },
  {
    icon: BarChart3,
    title: 'See if you can actually compete',
    description: 'Understand how crowded the market is and whether there\'s room for you to win.'
  },
  {
    icon: Target,
    title: 'Get a ready-made game plan',
    description: 'Receive a clear summary of who to sell to, what angle to market, and why this product will work.'
  }
]

export default function ProductDiscovery() {
  return (
    <section id="features" className="py-28 bg-landing-bg relative border-t border-landing-divider/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-landing-accent">Product Research</span>
          <h2 className="text-3xl md:text-5xl font-black text-landing-primary tracking-tight leading-tight">
            Find your next bestseller <br className="hidden md:block" />
            in minutes, not weeks.
          </h2>
          <p className="text-landing-secondary text-lg">
            Stop relying on gut feelings. Uncover products that are actually selling right now, backed by real data you can trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((benefit, i) => (
            <div key={i} className="p-6 rounded-2xl bg-landing-surface/50 border border-landing-divider/30 hover:border-landing-accent/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-landing-accent/10 flex items-center justify-center mb-6">
                <benefit.icon className="w-6 h-6 text-landing-accent" />
              </div>
              <h3 className="text-lg font-bold text-landing-primary mb-2">{benefit.title}</h3>
              <p className="text-sm text-landing-secondary leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Visual Example */}
        <div className="mt-16 landing-panel border border-landing-divider/40 overflow-hidden shadow-2xl">
          <div className="bg-landing-surface/90 px-6 py-4 border-b border-landing-divider/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-landing-accent" />
              <span className="text-xs font-bold text-landing-primary uppercase tracking-wider">Example Result</span>
            </div>
            <span className="text-[10px] font-bold text-landing-accentLime uppercase tracking-wider">High opportunity</span>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6 bg-landing-surface/20">
            <div>
              <p className="text-[10px] text-landing-muted font-bold uppercase tracking-wider mb-1">Product</p>
              <p className="text-lg font-bold text-landing-primary">Smart Posture Brace</p>
            </div>
            <div>
              <p className="text-[10px] text-landing-muted font-bold uppercase tracking-wider mb-1">Demand</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-landing-accentLime">84 / 100</p>
                <TrendingUp className="w-4 h-4 text-landing-accentLime" />
              </div>
            </div>
            <div>
              <p className="text-[10px] text-landing-muted font-bold uppercase tracking-wider mb-1">Competition</p>
              <p className="text-lg font-bold text-landing-accentSoft">Medium</p>
            </div>
            <div>
              <p className="text-[10px] text-landing-muted font-bold uppercase tracking-wider mb-1">Insight</p>
              <p className="text-sm text-landing-secondary">High search volume from office workers. Market with a back-pain-relief angle for best results.</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/auth/signup" className="btn-proper-primary inline-flex text-sm px-6 py-3">
            Start Researching Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}
