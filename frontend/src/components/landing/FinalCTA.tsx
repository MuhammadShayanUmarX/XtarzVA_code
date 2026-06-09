import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function FinalCTA() {
  return (
    <section className="py-32 bg-landing-bg relative overflow-hidden border-t border-landing-divider/10">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-landing-accent/20 blur-[150px] rounded-full pointer-events-none z-0" />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-landing-surface border border-landing-divider/30 mb-8">
          <div className="w-2 h-2 rounded-full bg-landing-accentLime animate-pulse" />
          <span className="text-[11px] font-bold text-landing-primary uppercase tracking-widest">
            Ready When You Are
          </span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black text-landing-primary tracking-tightest mb-8 leading-tight">
          Your next winning product <br/>
          <span className="text-landing-accent">is waiting.</span>
        </h2>
        
        <p className="text-xl text-landing-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
          Join thousands of sellers who stopped guessing and started scaling. Find products, beat competitors, and launch stores — all in one place.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/auth/signup"
            className="btn-proper-primary text-lg px-10 py-5 w-full sm:w-auto justify-center"
          >
            Start Free — No Credit Card
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}
