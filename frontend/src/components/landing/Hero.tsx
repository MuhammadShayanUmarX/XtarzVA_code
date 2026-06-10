import { ArrowRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center pt-36 pb-16 overflow-hidden bg-landing-bg bg-gradient-hero">
      <div className="relative z-10 max-w-4xl mx-auto px-6 w-full flex flex-col items-center text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-landing-surface border border-landing-divider">
          <span className="text-xs font-medium text-landing-secondary">
            Built for Shopify sellers
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-landing-primary tracking-tight leading-tight max-w-4xl mx-auto">
          Stop guessing.{' '}
          <br className="hidden md:block" />
          <span className="text-landing-accent">Start selling winners.</span>
        </h1>

        <p className="text-base md:text-lg text-landing-secondary leading-relaxed max-w-2xl mx-auto">
          Research products, map competitor gaps, model margins, and download an uploadable Shopify theme — before you spend on ads.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
          <Link to="/auth/signup" className="btn-proper-primary cursor-pointer px-8 py-3.5">
            Start free
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
          <a href="#demo" className="btn-proper-secondary px-8 py-3.5">
            <Play className="w-4 h-4 text-landing-accent" strokeWidth={1.5} />
            Watch demo
          </a>
        </div>

        <p className="text-sm text-landing-muted">
          No credit card required · Set up in under 3 minutes
        </p>
      </div>
    </section>
  )
}
