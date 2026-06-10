import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import DashboardPreview from '../components/landing/DashboardPreview'
import TrustedBy from '../components/landing/TrustedBy'
import ProblemSolution from '../components/landing/ProblemSolution'
import ProductDiscovery from '../components/landing/ProductDiscovery'
import CompetitorAnalysis from '../components/landing/CompetitorAnalysis'
import MarginSupplier from '../components/landing/MarginSupplier'
import ContentGeneration from '../components/landing/ContentGeneration'
import ShopifyDeployment from '../components/landing/ShopifyDeployment'
import EarlyAccess from '../components/landing/EarlyAccess'
import Testimonials from '../components/landing/Testimonials'
import Pricing from '../components/landing/Pricing'
import FinalCTA from '../components/landing/FinalCTA'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="bg-landing-bg min-h-screen text-landing-primary selection:bg-landing-accent/25 font-sans">
      <Navbar />
      <main>
        {/* 1. Hero — outcome-focused headline */}
        <Hero />
        {/* 2. Dashboard preview — show the product */}
        <DashboardPreview />
        {/* 3. Social Proof — trusted by */}
        <TrustedBy />
        {/* 3. Problem → Solution — relatable before/after */}
        <ProblemSolution />
        {/* 4. Product Research — find winners fast */}
        <ProductDiscovery />
        {/* 5. Competitor Intelligence — know the competition */}
        <CompetitorAnalysis />
        {/* 6. Sourcing & Margins — know your profit */}
        <MarginSupplier />
        {/* 7. Ad Creative — create ads that sell */}
        <ContentGeneration />
        {/* 8. Store Builder — go live on Shopify */}
        <ShopifyDeployment />
        {/* 9. How It Works — simple 3 steps */}
        <EarlyAccess />
        {/* 10. Testimonials — real results */}
        <Testimonials />
        {/* 11. Pricing */}
        <Pricing />
        {/* 12. Final CTA */}
        <FinalCTA />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  )
}
