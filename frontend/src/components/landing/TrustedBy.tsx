export default function TrustedBy() {
  const brands = [
    'Apex Commerce',
    'Velocity Brands',
    'Elevate Agencies',
    'Nexus Retail',
    'Lumina Brands',
    'Quantum Commerce',
  ]

  return (
    <section className="py-10 bg-landing-bg border-t border-landing-divider">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs font-medium text-landing-muted mb-8">
          Built for Shopify sellers and growth agencies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 opacity-50">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-sm font-medium text-landing-secondary whitespace-nowrap"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
