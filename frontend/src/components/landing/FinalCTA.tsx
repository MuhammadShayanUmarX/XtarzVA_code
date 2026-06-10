import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function FinalCTA() {
  return (
    <section className="py-24 bg-landing-bg border-t border-landing-divider">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-semibold text-landing-primary tracking-tight mb-6 leading-tight">
          Your next winning product{' '}
          <span className="text-landing-accent">starts here.</span>
        </h2>

        <p className="text-lg text-landing-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
          Research products, validate margins, and download a launch-ready Shopify theme — before you spend on ads.
        </p>

        <Link to="/auth/signup" className="btn-proper-primary px-10 py-3.5 inline-flex">
          Start free
          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  )
}
