import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const PLANS = [
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'For sellers launching their first profitable store.',
    features: [
      'Find up to 10 winning products per month',
      'Competitor pricing & gap analysis',
      'Margin calculator with supplier costs',
      'SEO-ready product titles & descriptions',
      'Direct Shopify store integration'
    ],
    buttonText: 'Get Started',
    popular: false,
  },
  {
    name: 'Growth',
    price: '$299',
    period: '/month',
    description: 'For brands scaling fast with high-volume needs.',
    features: [
      'Unlimited product research',
      'Advanced competitor analysis & gap detection',
      'Facebook Ad hooks & TikTok scripts included',
      'Bulk product push to Shopify',
      'Priority support & onboarding',
      'Access to private seller community'
    ],
    buttonText: 'Get Started',
    popular: true,
  }
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 bg-landing-surface/30 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-landing-accent">Pricing</span>
          <h2 className="text-3xl md:text-5xl font-black text-landing-primary tracking-tightest mt-4 leading-tight">
            One platform. No more juggling <br className="hidden md:block" />
            five different subscriptions.
          </h2>
          <p className="text-landing-secondary mt-4 max-w-2xl mx-auto text-lg">
            Everything you need to find winners, beat competitors, and launch fast — in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PLANS.map((plan, index) => (
            <div 
              key={index} 
              className={`relative p-8 rounded-2xl flex flex-col h-full
                ${plan.popular 
                  ? 'bg-landing-surface border-2 border-landing-accent shadow-[0_0_40px_rgba(62,99,221,0.15)]' 
                  : 'bg-landing-bg border border-landing-divider/30 hover:border-landing-divider/50 transition-colors'
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-landing-accent text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-black text-landing-primary tracking-tight">{plan.name}</h3>
                <p className="text-landing-secondary text-sm mt-2 h-10">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-black text-landing-primary tracking-tighter">{plan.price}</span>
                <span className="text-landing-secondary font-bold ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-landing-accent' : 'text-landing-muted'}`} />
                    <span className="text-sm font-medium text-landing-primary">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                to="/auth/signup"
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all
                  ${plan.popular 
                    ? 'bg-landing-accent hover:bg-landing-accent/90 text-white shadow-lg' 
                    : 'bg-landing-surface border border-landing-divider/30 text-landing-primary hover:bg-landing-surface/80'
                  }`}
              >
                {plan.buttonText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Reassurance */}
        <div className="text-center mt-10 space-y-2">
          <p className="text-sm text-landing-muted">No credit card required to start. Cancel anytime.</p>
        </div>
      </div>
    </section>
  )
}
