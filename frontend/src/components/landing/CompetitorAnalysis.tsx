import { Eye, TrendingDown, Store } from 'lucide-react'

const COMPETITORS = [
  { name: "Top Store A", price: "$59.99", gap: "Weak product descriptions" },
  { name: "Store B", price: "$45.00", gap: "Not running video ads" },
  { name: "Store C", price: "$65.00", gap: "Frequently out of stock" }
]

export default function CompetitorAnalysis() {
  return (
    <section className="py-28 bg-landing-surface/30 relative border-t border-landing-divider/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-landing-accent">Competitor Intelligence</span>
          <h2 className="text-3xl md:text-5xl font-black text-landing-primary tracking-tight leading-tight">
            See exactly what your <br className="hidden md:block"/>
            competitors are doing wrong.
          </h2>
          <p className="text-landing-secondary text-lg">
            Know their prices, find their weaknesses, and position your store to win — before you even launch.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-landing-accent/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-landing-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-landing-primary mb-2">Find the right price point</h3>
                <p className="text-landing-secondary">See what others are charging and find room to undercut them or charge a premium for a better offer.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-landing-accentSoft/10 flex items-center justify-center">
                <Store className="w-6 h-6 text-landing-accentSoft" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-landing-primary mb-2">Exploit their blind spots</h3>
                <p className="text-landing-secondary">Spot bad reviews, missing marketing, and weak product pages — then use those gaps to stand out.</p>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="landing-panel border border-landing-divider/40 overflow-hidden shadow-2xl bg-landing-bg">
            <div className="px-6 py-4 border-b border-landing-divider/40 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-landing-accent" />
              <span className="text-xs font-bold text-landing-primary uppercase tracking-wider">Competitor Overview</span>
            </div>
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-landing-surface/50 border-b border-landing-divider/20">
                    <th className="p-4 text-xs font-bold text-landing-muted uppercase">Competitor</th>
                    <th className="p-4 text-xs font-bold text-landing-muted uppercase">Price</th>
                    <th className="p-4 text-xs font-bold text-landing-muted uppercase">Your Opportunity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-landing-divider/20">
                  {COMPETITORS.map((comp, idx) => (
                    <tr key={idx} className="hover:bg-landing-surface/30 transition-colors">
                      <td className="p-4 text-sm font-bold text-landing-primary">{comp.name}</td>
                      <td className="p-4 text-sm font-mono text-landing-secondary">{comp.price}</td>
                      <td className="p-4 text-sm text-landing-accentLime">{comp.gap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
