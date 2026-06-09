import { Search, BarChart3, Rocket } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: Search,
    title: 'Tell us what you\'re looking for',
    description: 'Enter a product idea, niche, or trend — or let Xtarz discover opportunities for you automatically.',
  },
  {
    number: '02',
    icon: BarChart3,
    title: 'Get the full picture in seconds',
    description: 'See demand scores, competitor gaps, supplier costs, and profit margins — all validated and ready to act on.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Launch your store and start selling',
    description: 'Product pages, descriptions, images, and pricing get pushed to your Shopify store. You\'re live and ready for customers.',
  },
]

export default function EarlyAccess() {
  return (
    <section id="how-it-works" className="py-28 bg-landing-surface/30 relative border-t border-landing-divider/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-landing-accent">How It Works</span>
          <h2 className="text-3xl md:text-5xl font-black text-landing-primary tracking-tightest mt-4 leading-tight">
            From idea to live store <br className="hidden md:block" />
            in three simple steps.
          </h2>
          <p className="text-base md:text-lg text-landing-secondary max-w-2xl mx-auto mt-5">
            No learning curve. No complicated setup. Just results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div key={i} className="relative p-8 rounded-2xl bg-landing-bg border border-landing-divider/30 hover:border-landing-accent/30 transition-all group">
              {/* Step number */}
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-xl bg-landing-accent/10 border border-landing-accent/20 flex items-center justify-center group-hover:bg-landing-accent/15 transition-colors">
                  <step.icon className="w-7 h-7 text-landing-accent" />
                </div>
                <span className="text-5xl font-black text-landing-divider/40 tracking-tightest">{step.number}</span>
              </div>

              <h3 className="text-xl font-bold text-landing-primary mb-3">{step.title}</h3>
              <p className="text-sm text-landing-secondary leading-relaxed">{step.description}</p>

              {/* Connector line for desktop */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-landing-divider/40" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
