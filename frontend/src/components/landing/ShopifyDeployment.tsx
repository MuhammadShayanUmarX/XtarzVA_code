import { ArrowRight, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const ICON = { strokeWidth: 1.5 as const }

const WHAT_GETS_DONE = [
  'Complete Shopify OS 2.0 theme ZIP',
  'Branded sections, templates, and assets',
  'Product import JSON with SEO from Ad Creative',
  'Upload in Shopify Admin → Themes → Add theme',
]

export default function ShopifyDeployment() {
  return (
    <section className="py-24 bg-landing-bg border-t border-landing-divider">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="section-eyebrow">Store builder</span>

            <h2 className="text-3xl md:text-4xl font-semibold text-landing-primary tracking-tight leading-tight">
              Launch on Shopify{' '}
              <span className="text-landing-accent">in minutes, not days.</span>
            </h2>

            <p className="text-landing-secondary text-lg leading-relaxed">
              Download a full uploadable Shopify theme ZIP — layout, sections, hero assets, and product import file. Upload in minutes, then publish when ready.
            </p>

            <ul className="space-y-3 pt-2">
              {WHAT_GETS_DONE.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-landing-secondary">
                  <CheckCircle2 className="w-5 h-5 text-landing-accentLime shrink-0" {...ICON} />
                  <span className="font-medium text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link to="/auth/signup" className="btn-proper-primary inline-flex">
                Get started
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          <div className="landing-panel overflow-hidden">
            <div className="px-6 py-4 bg-landing-elevated border-b border-landing-divider flex items-center justify-between">
              <span className="text-sm font-medium text-landing-primary flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-landing-accent" {...ICON} />
                Your store
              </span>
              <span className="text-xs font-medium metric-up">Ready to publish</span>
            </div>

            <div className="p-8">
              <div className="p-6 rounded-xl landing-card space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-landing-elevated border border-landing-divider flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-landing-muted" {...ICON} />
                    </div>
                    <div>
                      <p className="font-semibold text-landing-primary">Smart Posture Brace</p>
                      <p className="text-xs text-landing-secondary">Active · 3 variants</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-landing-accentLime/10 text-xs font-medium metric-up">
                    Theme ready
                  </span>
                </div>

                <div className="h-px bg-landing-divider w-full" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-landing-muted">Selling price</span>
                  <span className="font-mono font-semibold text-landing-primary">$49.99</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-landing-muted">Profit margin</span>
                  <span className="font-mono font-semibold metric-up">75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
