import { Star, TrendingUp } from 'lucide-react'

const REVIEWS = [
  {
    quote: 'I used to spend entire weekends researching products. Now I find validated winners in under an hour and have a launch pack the same day.',
    name: 'Marcus K.',
    role: 'Shopify store owner',
    revenue: '+$18,400/mo',
    initials: 'MK',
  },
  {
    quote: 'The margin breakdown saved me from launching a product that looked great but would have lost money. Paid for itself in week one.',
    name: 'Priya S.',
    role: 'DTC brand founder',
    revenue: '+$9,200/mo',
    initials: 'PS',
  },
  {
    quote: 'Competitor analysis showed gaps I never would have found manually. I repositioned pricing and copy before spending on ads.',
    name: 'Daniel R.',
    role: 'E-commerce operator',
    revenue: '+$54,000/mo',
    initials: 'DR',
  },
  {
    quote: 'Had a theme ZIP, product copy, and ad hooks ready in one afternoon. Uploaded to Shopify the same evening.',
    name: 'Sophie L.',
    role: 'Brand owner',
    revenue: '+$12,700/mo',
    initials: 'SL',
  },
]

export default function Testimonials() {
  return (
    <section id="results" className="py-24 bg-landing-bg border-t border-landing-divider">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="section-eyebrow">Seller results</span>
          <h2 className="text-3xl md:text-4xl font-semibold text-landing-primary tracking-tight mt-3 leading-tight">
            Sellers scaling faster{' '}
            <span className="text-landing-accent">with XtarzVA.</span>
          </h2>
          <p className="text-base text-landing-secondary max-w-2xl mx-auto mt-4">
            What merchants report after running the full workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS.map((rev) => (
            <div key={rev.name} className="p-8 landing-card flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-3.5 h-3.5 fill-landing-accentSoft text-landing-accentSoft"
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                <blockquote className="text-sm text-landing-primary leading-relaxed">
                  &quot;{rev.quote}&quot;
                </blockquote>
              </div>

              <div className="flex items-center justify-between pt-6 mt-6 border-t border-landing-divider">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-landing-accent/10 flex items-center justify-center text-xs font-semibold text-landing-primary border border-landing-accent/20">
                    {rev.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-landing-primary">{rev.name}</p>
                    <p className="text-xs text-landing-muted">{rev.role}</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-landing-accentLime/10 border border-landing-accentLime/20 flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-landing-accentLime" strokeWidth={1.5} />
                  <span className="text-xs font-medium metric-up">{rev.revenue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
