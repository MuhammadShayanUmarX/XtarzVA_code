export default function TrustedBy() {
  const brands = [
    "Apex Commerce",
    "Velocity Brands",
    "Elevate Agencies",
    "Nexus Retail",
    "Lumina Brands",
    "Quantum Commerce",
  ]

  const marqueeBrands = [...brands, ...brands, ...brands, ...brands]

  return (
    <section className="py-12 bg-landing-bg border-t border-landing-divider/10 overflow-hidden relative">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
            display: flex;
            width: max-content;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-6 text-center mb-8 relative z-10">
        <p className="text-[11px] font-bold text-landing-muted uppercase tracking-widest">
          Trusted by Shopify sellers and growth agencies worldwide
        </p>
      </div>
      
      <div className="relative w-full max-w-7xl mx-auto overflow-hidden">
        {/* Gradient Masks for smooth fading edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-landing-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-landing-bg to-transparent z-10 pointer-events-none" />
        
        <div className="animate-marquee gap-16 md:gap-32 opacity-60">
          {marqueeBrands.map((brand, i) => (
            <div key={i} className="text-sm md:text-xl font-black tracking-tighter text-landing-secondary hover:text-landing-primary transition-colors whitespace-nowrap">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
