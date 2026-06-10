import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const PLANS = [
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'For sellers launching their first profitable store.',
    features: [
      'Up to 10 product research runs per month',
      'Competitor pricing & gap analysis',
      'Margin calculator with supplier costs',
      'SEO-ready product titles & descriptions',
      'Uploadable Shopify theme ZIP export',
    ],
    buttonText: 'Get started',
    popular: false,
  },
  {
    name: 'Growth',
    price: '$299',
    period: '/month',
    description: 'For brands scaling with higher research volume.',
    features: [
      'Unlimited product research',
      'Advanced competitor analysis',
      'Facebook ad hooks & TikTok scripts',
      'Priority theme & creative exports',
      'Priority support & onboarding',
      'Private seller community access',
    ],
    buttonText: 'Get started',
    popular: true,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-landing-surface border-t border-landing-divider">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="section-eyebrow">Pricing</span>
          <h2 className="text-3xl md:text-4xl font-semibold text-landing-primary tracking-tight mt-3 leading-tight">
            One platform. No more juggling{' '}
            <br className="hidden md:block" />
            five different subscriptions.
          </h2>
          <p className="text-landing-secondary mt-4 max-w-2xl mx-auto text-lg">
            Research, margins, creatives, and store assets — in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-xl flex flex-col h-full ${
                plan.popular
                  ? 'landing-card border-landing-accent'
                  : 'landing-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-landing-accent text-white text-xs font-medium rounded-full">
                  Most popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-landing-primary">{plan.name}</h3>
                <p className="text-landing-secondary text-sm mt-2 min-h-[40px]">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-semibold text-landing-primary">{plan.price}</span>
                <span className="text-landing-secondary ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2
                      className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-landing-accent' : 'text-landing-muted'}`}
                      strokeWidth={1.5}
                    />
                    <span className="text-sm text-landing-primary">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/auth/signup"
                className={
                  plan.popular
                    ? 'btn-proper-primary w-full justify-center'
                    : 'btn-proper-secondary w-full justify-center'
                }
              >
                {plan.buttonText}
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 text-sm text-landing-muted">
          No credit card required to start. Cancel anytime.
        </p>
      </div>
    </section>
  )
}
