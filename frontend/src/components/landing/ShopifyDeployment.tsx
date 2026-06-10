import { ArrowRight, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const WHAT_GETS_DONE = [
  "Complete Shopify OS 2.0 theme ZIP",
  "Branded sections, templates, and assets",
  "Product import JSON with SEO from Ad Creative",
  "Upload directly in Shopify Admin → Themes"
]

export default function ShopifyDeployment() {
  return (
    <section className="py-28 bg-landing-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-5 z-0"
           style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
           
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-landing-accent">Store Builder</span>
            
            <h2 className="text-3xl md:text-5xl font-black text-landing-primary tracking-tight leading-tight">
              Go live on Shopify <br/>
              <span className="text-landing-accent">in minutes, not days.</span>
            </h2>
            
            <p className="text-landing-secondary text-lg leading-relaxed">
              Download a full uploadable Shopify theme ZIP — layout, sections, hero assets, and product import file. Upload in minutes, then publish when ready.
            </p>

            <ul className="space-y-4 pt-4">
              {WHAT_GETS_DONE.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-landing-secondary">
                  <CheckCircle2 className="w-5 h-5 text-landing-accentLime" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-4">
              <Link to="/auth/signup" className="btn-proper-primary inline-flex">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Mock Shopify Store Panel */}
          <div className="landing-panel border border-landing-divider/40 overflow-hidden shadow-2xl relative">
            <div className="px-6 py-4 bg-landing-surface/90 border-b border-landing-divider/40 flex items-center justify-between">
              <span className="text-[10px] font-bold text-landing-primary uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag className="w-3.5 h-3.5 text-landing-accent" /> Your Store
              </span>
              <span className="text-[10px] font-bold text-landing-accentLime uppercase">Live</span>
            </div>
            
            <div className="p-8 bg-landing-surface/30">
              <div className="p-6 rounded-xl bg-landing-bg border border-landing-divider/30 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-landing-surface border border-landing-divider/30 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-landing-muted" />
                    </div>
                    <div>
                      <p className="font-bold text-landing-primary">Smart Posture Brace</p>
                      <p className="text-xs text-landing-secondary">Active &middot; 3 Variants</p>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded bg-landing-accentLime/10 text-[10px] font-bold text-landing-accentLime uppercase tracking-wider">
                    Published
                  </div>
                </div>
                
                <div className="h-px bg-landing-divider/20 w-full" />
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-landing-muted">Selling Price:</span>
                  <span className="font-mono font-bold text-landing-primary">$49.99</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-landing-muted">Profit Margin:</span>
                  <span className="font-mono font-bold text-landing-accentLime">75%</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
