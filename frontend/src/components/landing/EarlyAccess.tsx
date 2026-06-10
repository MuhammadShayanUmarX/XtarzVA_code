import { Search, BarChart3, Store } from 'lucide-react'

const ICON = { strokeWidth: 1.5 as const }

const STEPS = [
  {
    number: '01',
    icon: Search,
    title: 'Tell us what you\'re looking for',
    description: 'Enter a product idea, niche, or trend — XtarzVA surfaces opportunities from live market research.',
  },
  {
    number: '02',
    icon: BarChart3,
    title: 'Get the full picture',
    description: 'Demand scores, competitor gaps, supplier costs, and profit margins in one report.',
  },
  {
    number: '03',
    icon: Store,
    title: 'Download and launch',
    description: 'Theme ZIP, product copy, ad creatives, and import files — ready for Shopify Admin.',
  },
]

export default function EarlyAccess() {
  return (
    <section id="how-it-works" className="py-24 bg-landing-surface border-t border-landing-divider">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="section-eyebrow">How it works</span>
          <h2 className="text-3xl md:text-4xl font-semibold text-landing-primary tracking-tight mt-3 leading-tight">
            From idea to launch-ready store{' '}
            <br className="hidden md:block" />
            in three steps.
          </h2>
          <p className="text-base text-landing-secondary max-w-2xl mx-auto mt-4">
            No complicated setup. A clear workflow built for Shopify sellers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div key={i} className="relative p-8 landing-card">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-lg bg-landing-accent/10 border border-landing-accent/20 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-landing-accent" {...ICON} />
                </div>
                <span className="text-2xl font-semibold text-landing-divider">{step.number}</span>
              </div>

              <h3 className="text-lg font-semibold text-landing-primary mb-2">{step.title}</h3>
              <p className="text-sm text-landing-secondary leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
