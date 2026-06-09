import { Calculator, DollarSign, PackageCheck } from 'lucide-react'

export default function MarginSupplier() {
  return (
    <section className="py-28 bg-landing-bg relative border-t border-landing-divider/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-landing-accent">Sourcing & Margins</span>
          <h2 className="text-3xl md:text-5xl font-black text-landing-primary tracking-tight leading-tight">
            Know your real profit <br className="hidden md:block" />
            before you spend a dollar.
          </h2>
          <p className="text-landing-secondary text-lg">
            See supplier costs, shipping fees, and net margins instantly. No more launching products only to discover they're barely profitable.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-landing-surface border border-landing-divider/30 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-landing-accent/10 flex items-center justify-center mb-6">
              <PackageCheck className="w-8 h-8 text-landing-accent" />
            </div>
            <p className="text-sm font-bold text-landing-muted uppercase tracking-wider mb-2">Supplier Cost</p>
            <p className="text-4xl font-mono font-black text-landing-primary">$12.50</p>
            <p className="text-xs text-landing-secondary mt-2">Including shipping</p>
          </div>

          <div className="p-8 rounded-2xl bg-landing-surface border border-landing-divider/30 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-landing-accentSoft/10 flex items-center justify-center mb-6">
              <DollarSign className="w-8 h-8 text-landing-accentSoft" />
            </div>
            <p className="text-sm font-bold text-landing-muted uppercase tracking-wider mb-2">Your Selling Price</p>
            <p className="text-4xl font-mono font-black text-landing-primary">$49.99</p>
            <p className="text-xs text-landing-secondary mt-2">Based on market data</p>
          </div>

          <div className="p-8 rounded-2xl bg-landing-surface border border-landing-divider/30 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-landing-accentLime/5 to-transparent pointer-events-none" />
            <div className="w-16 h-16 mx-auto rounded-full bg-landing-accentLime/10 flex items-center justify-center mb-6 relative z-10">
              <Calculator className="w-8 h-8 text-landing-accentLime" />
            </div>
            <p className="text-sm font-bold text-landing-muted uppercase tracking-wider mb-2 relative z-10">Your Profit Margin</p>
            <p className="text-4xl font-mono font-black text-landing-accentLime relative z-10">75%</p>
            <p className="text-xs text-landing-secondary mt-2 relative z-10">High profit potential</p>
          </div>
        </div>
      </div>
    </section>
  )
}
