import { ArrowRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center pt-40 pb-16 overflow-hidden bg-landing-bg">
      {/* Subtle backdrop grid */}
      <div className="absolute inset-0 pointer-events-none opacity-5 z-0"
           style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      {/* Muted background mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-[-10%] left-[20%] w-[800px] h-[600px] bg-landing-accentSoft/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 w-full flex flex-col items-center text-center space-y-8">
        
        {/* Social proof pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-landing-accent/10 border border-landing-accent/20">
          <div className="w-1.5 h-1.5 rounded-full bg-landing-accent animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-landing-accent tracking-wider uppercase">
            Early access — Limited spots available
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-landing-primary tracking-tightest leading-tight max-w-4xl mx-auto">
          Stop guessing. <br className="hidden md:block"/>
          <span className="text-landing-accent">Start selling winners.</span>
        </h1>

        {/* Positioning Statement */}
        <p className="text-base md:text-xl text-landing-secondary leading-relaxed max-w-2xl mx-auto">
          Find proven products, see exactly what your competitors are missing, and launch to your Shopify store — all before your morning coffee gets cold.
        </p>

        {/* Proper Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
          <Link
            to="/auth/signup"
            className="btn-proper-primary cursor-pointer text-lg px-8 py-4"
          >
            Start Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <a
            href="#demo"
            className="btn-proper-secondary text-lg px-8 py-4"
          >
            <Play className="w-4 h-4 mr-2 fill-current text-landing-accent" />
            Watch 2-Min Demo
          </a>
        </div>

        {/* Trust line */}
        <p className="text-xs text-landing-muted pt-2">
          No credit card required · Set up in under 3 minutes
        </p>

      </div>
    </section>
  )
}
