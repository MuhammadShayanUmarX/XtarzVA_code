import { Eye, TrendingDown, Store } from 'lucide-react'

const ICON = { strokeWidth: 1.5 as const }

const COMPETITORS = [
  { name: 'Top Store A', price: '$59.99', gap: 'Weak product descriptions' },
  { name: 'Store B', price: '$45.00', gap: 'Not running video ads' },
  { name: 'Store C', price: '$65.00', gap: 'Frequently out of stock' },
]

export default function CompetitorAnalysis() {
  return (
    <section className="py-24 bg-landing-surface border-t border-landing-divider">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="section-eyebrow">Competitor intelligence</span>
          <h2 className="text-3xl md:text-4xl font-semibold text-landing-primary tracking-tight leading-tight">
            See exactly what your{' '}
            <br className="hidden md:block" />
            competitors are doing wrong.
          </h2>
          <p className="text-landing-secondary text-lg">
            Know their prices, find their weaknesses, and position your store to win — before you launch.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-landing-accent/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-landing-accent" {...ICON} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-landing-primary mb-2">Find the right price point</h3>
                <p className="text-landing-secondary">See what others charge and find room to undercut or charge a premium for a better offer.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-landing-accent/10 flex items-center justify-center">
                <Store className="w-5 h-5 text-landing-accent" {...ICON} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-landing-primary mb-2">Exploit their blind spots</h3>
                <p className="text-landing-secondary">Spot bad reviews, weak marketing, and thin product pages — then use those gaps to stand out.</p>
              </div>
            </div>
          </div>

          <div className="landing-panel overflow-hidden">
            <div className="px-6 py-4 border-b border-landing-divider flex items-center gap-2 bg-landing-elevated">
              <TrendingDown className="w-4 h-4 text-landing-accent" {...ICON} />
              <span className="text-sm font-medium text-landing-primary">Competitor overview</span>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-landing-divider">
                  <th className="p-4 text-xs font-medium text-landing-muted">Competitor</th>
                  <th className="p-4 text-xs font-medium text-landing-muted">Price</th>
                  <th className="p-4 text-xs font-medium text-landing-muted">Your opportunity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-landing-divider">
                {COMPETITORS.map((comp, idx) => (
                  <tr key={idx} className="hover:bg-landing-elevated/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-landing-primary">{comp.name}</td>
                    <td className="p-4 text-sm font-mono text-landing-secondary">{comp.price}</td>
                    <td className="p-4 text-sm metric-up">{comp.gap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
