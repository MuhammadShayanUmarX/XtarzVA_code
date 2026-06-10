import { Calculator, DollarSign, PackageCheck } from 'lucide-react'

const ICON = { strokeWidth: 1.5 as const }

export default function MarginSupplier() {
  return (
    <section className="py-24 bg-landing-bg border-t border-landing-divider">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="section-eyebrow">Sourcing & margins</span>
          <h2 className="text-3xl md:text-4xl font-semibold text-landing-primary tracking-tight leading-tight">
            Know your real profit{' '}
            <br className="hidden md:block" />
            before you spend a dollar.
          </h2>
          <p className="text-landing-secondary text-lg">
            See supplier costs, shipping fees, and net margins instantly — before you commit inventory or ad spend.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-8 landing-card text-center">
            <div className="w-12 h-12 mx-auto rounded-lg bg-landing-accent/10 flex items-center justify-center mb-5">
              <PackageCheck className="w-5 h-5 text-landing-accent" {...ICON} />
            </div>
            <p className="text-sm font-medium text-landing-muted mb-2">Supplier cost</p>
            <p className="text-4xl font-semibold font-mono text-landing-primary">$12.50</p>
            <p className="text-xs text-landing-secondary mt-2">Including shipping</p>
          </div>

          <div className="p-8 landing-card text-center">
            <div className="w-12 h-12 mx-auto rounded-lg bg-landing-accent/10 flex items-center justify-center mb-5">
              <DollarSign className="w-5 h-5 text-landing-accent" {...ICON} />
            </div>
            <p className="text-sm font-medium text-landing-muted mb-2">Your selling price</p>
            <p className="text-4xl font-semibold font-mono text-landing-primary">$49.99</p>
            <p className="text-xs text-landing-secondary mt-2">Based on market data</p>
          </div>

          <div className="p-8 landing-card text-center">
            <div className="w-12 h-12 mx-auto rounded-lg bg-landing-accentLime/10 flex items-center justify-center mb-5">
              <Calculator className="w-5 h-5 text-landing-accentLime" {...ICON} />
            </div>
            <p className="text-sm font-medium text-landing-muted mb-2">Your profit margin</p>
            <p className="text-4xl font-semibold font-mono metric-up">75%</p>
            <p className="text-xs text-landing-secondary mt-2">High profit potential</p>
          </div>
        </div>
      </div>
    </section>
  )
}
