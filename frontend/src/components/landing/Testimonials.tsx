import { motion } from 'framer-motion'
import { Star, TrendingUp } from 'lucide-react'

const REVIEWS = [
  {
    quote: "I used to spend entire weekends researching products. Now I find validated winners in 10 minutes and go live the same day.",
    name: "Marcus K.", role: "Shopify Store Owner", revenue: "+$18,400/mo", initials: "MK"
  },
  {
    quote: "The margin calculator saved me from launching a product that looked great but would've lost money. Paid for itself in week one.",
    name: "Priya S.", role: "DTC Brand Founder", revenue: "+$9,200/mo", initials: "PS"
  },
  {
    quote: "I went from running 1 store to 6 — by myself. The competitor analysis alone showed me gaps I never would've found on my own.",
    name: "Daniel R.", role: "E-commerce Operator", revenue: "+$54,000/mo", initials: "DR"
  },
  {
    quote: "Launched my first product in under 4 hours. Verified the margins, got ad copy written, and pushed everything to Shopify instantly.",
    name: "Sophie L.", role: "Brand Owner", revenue: "+$12,700/mo", initials: "SL"
  }
]

const ReviewCard = ({ rev }: { rev: typeof REVIEWS[0] }) => (
  <div className="w-[380px] flex-shrink-0 p-8 landing-panel border border-landing-divider/30 flex flex-col justify-between mx-4">
    <div>
      <div className="flex gap-1 mb-6">
        {[1, 2, 3, 4, 5].map(s => (
          <Star key={s} className="w-3.5 h-3.5 fill-landing-accentLime text-landing-accentLime" />
        ))}
      </div>
      <blockquote className="text-sm font-semibold text-landing-primary leading-relaxed mb-8">
        "{rev.quote}"
      </blockquote>
    </div>

    <div className="flex items-center justify-between pt-6 border-t border-landing-divider/20">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-landing-accent/20 flex items-center justify-center text-xs font-bold text-landing-primary border border-landing-accent/30">
          {rev.initials}
        </div>
        <div>
          <p className="text-xs font-bold text-landing-primary">{rev.name}</p>
          <p className="text-[10px] text-landing-muted font-medium">{rev.role}</p>
        </div>
      </div>
      <div className="px-2.5 py-1 rounded bg-landing-accentLime/10 border border-landing-accentLime/20 flex items-center gap-1.5">
         <TrendingUp className="w-3 h-3 text-landing-accentLime" />
         <span className="text-[10px] font-bold text-landing-accentLime">{rev.revenue}</span>
      </div>
    </div>
  </div>
)

export default function Testimonials() {
  const row1 = [...REVIEWS, ...REVIEWS, ...REVIEWS]

  return (
    <section id="testimonials" className="py-28 bg-landing-bg relative overflow-hidden border-t border-landing-divider/10">
      <div className="relative z-10">
        
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-landing-accent">Real Results</span>
          <h2 className="text-3xl md:text-5xl font-black text-landing-primary tracking-tightest mt-4 leading-tight">
            Sellers are scaling faster <br className="hidden md:block" />
            <span className="text-landing-accent">with Xtarz.</span>
          </h2>
          <p className="text-base text-landing-secondary max-w-2xl mx-auto mt-4">
            Don't take our word for it. Here's what real sellers say about their results.
          </p>
        </div>

        {/* Ticker Row */}
        <div className="relative flex overflow-hidden py-4">
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-landing-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-landing-bg to-transparent z-10 pointer-events-none" />
          
          <motion.div 
            animate={{ x: [0, -412 * REVIEWS.length] }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="flex"
          >
            {row1.map((rev, i) => (
              <ReviewCard key={i} rev={rev} />
            ))}
          </motion.div>
        </div>

        {/* Key Metrics */}
        <div className="mt-20 max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { val: '2,400+', label: 'Stores Using Xtarz' },
            { val: '$2.1M+', label: 'Revenue Generated' },
            { val: '97.2%', label: 'Satisfaction Rate' },
            { val: '4.9 / 5', label: 'Average Rating' },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <p className="text-3xl font-black text-landing-primary tracking-tightest tabular-nums">{item.val}</p>
              <p className="text-xs font-bold text-landing-muted uppercase tracking-wider">{item.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
