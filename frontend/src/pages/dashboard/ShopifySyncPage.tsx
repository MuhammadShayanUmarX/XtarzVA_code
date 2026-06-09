import { useState } from 'react'
import { Wand2, ArrowRight, CheckCircle2, Loader2, Download, FileText, Megaphone, Image } from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import DiscoveredProductPicker from '../../components/dashboard/DiscoveredProductPicker'

const BRAND_TONES = ['Professional', 'Playful', 'Luxury', 'Minimalist', 'Bold', 'Friendly'] as const
const PRICE_RANGES = ['Budget ($)', 'Mid-range ($$)', 'Premium ($$$)', 'Luxury ($$$$)'] as const

export default function ShopifySyncPage() {
  const [productName, setProductName] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [brandTone, setBrandTone] = useState<string>(BRAND_TONES[0])
  const [priceRange, setPriceRange] = useState<string>(PRICE_RANGES[1])
  const [competitorUrl, setCompetitorUrl] = useState('')
  const [sellingPoints, setSellingPoints] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const buildInitialInput = () => ({
    query: productName.trim(),
    product_name: productName.trim(),
    target_audience: targetAudience.trim(),
    brand_tone: brandTone,
    price_range: priceRange,
    ...(competitorUrl.trim() && { competitor_url: competitorUrl.trim() }),
    ...(sellingPoints.trim() && { selling_points: sellingPoints.trim() }),
  })

  const handleBuildStore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productName.trim()) return

    setIsSubmitting(true)
    try {
      const res = await api.post('/v2/runs/standalone', {
        stage: 'commerce_creation',
        initial_input: buildInitialInput(),
      })
      toast.success('Store build started!')
      navigate(`/dashboard/workflow?run_id=${res.data.run_id}&standalone=true`)
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to initialize store builder')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet">
              <Wand2 size={24} />
            </div>
            <h1 className="text-4xl font-black text-landing-primary tracking-tight">Store Builder</h1>
          </div>
          <p className="text-lg text-landing-secondary font-medium leading-relaxed max-w-2xl">
            Build a Shopify-ready store like an expert — product pages, SEO, collections, homepage copy, and a downloadable ZIP package.
          </p>
        </div>
      </header>

      <section className="glass-panel p-8 md:p-12 rounded-[32px] border-landing-divider">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet mx-auto">
              <Wand2 size={32} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Tell us about your store</h2>
            <p className="text-sm text-landing-muted">A Shopify expert would ask these questions before building your storefront.</p>
          </div>

          <form onSubmit={handleBuildStore} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-landing-muted tracking-tight">Product name *</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Ergonomic Desk Footrest"
                className="w-full h-14 bg-landing-bg border-2 border-landing-divider focus:border-accent-violet rounded-2xl px-5 text-base text-white placeholder:text-landing-muted focus:outline-none transition-all font-medium"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-landing-muted tracking-tight">Target audience</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Remote workers aged 25-45 with home offices"
                className="w-full h-12 bg-landing-bg border border-landing-divider focus:border-accent-violet/50 rounded-xl px-5 text-sm text-white placeholder:text-landing-muted focus:outline-none transition-all"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-landing-muted tracking-tight">Brand tone</label>
                <select
                  value={brandTone}
                  onChange={(e) => setBrandTone(e.target.value)}
                  className="w-full h-12 bg-landing-bg border border-landing-divider focus:border-accent-violet/50 rounded-xl px-5 text-sm text-white focus:outline-none transition-all"
                  disabled={isSubmitting}
                >
                  {BRAND_TONES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-landing-muted tracking-tight">Price positioning</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full h-12 bg-landing-bg border border-landing-divider focus:border-accent-violet/50 rounded-xl px-5 text-sm text-white focus:outline-none transition-all"
                  disabled={isSubmitting}
                >
                  {PRICE_RANGES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-landing-muted tracking-tight">Competitor URL (optional)</label>
              <input
                type="url"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                placeholder="https://competitor-store.myshopify.com"
                className="w-full h-12 bg-landing-bg border border-landing-divider focus:border-accent-violet/50 rounded-xl px-5 text-sm text-white placeholder:text-landing-muted focus:outline-none transition-all"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-landing-muted tracking-tight">Key selling points (optional)</label>
              <textarea
                value={sellingPoints}
                onChange={(e) => setSellingPoints(e.target.value)}
                placeholder="e.g. Memory foam, adjustable height, ships in 2 days"
                rows={2}
                className="w-full bg-landing-bg border border-landing-divider focus:border-accent-violet/50 rounded-xl px-5 py-3 text-sm text-white placeholder:text-landing-muted focus:outline-none transition-all resize-none"
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={!productName.trim() || isSubmitting}
              className="w-full h-14 bg-accent-violet hover:bg-accent-violet/90 text-white font-black text-sm rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Build Store'}
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-landing-divider/50">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent-violet">
                <FileText size={16} />
                <span className="text-xs font-black tracking-tight">Product + SEO</span>
              </div>
              <p className="text-[10px] text-landing-muted leading-relaxed">Titles, HTML descriptions, meta tags, and variants ready for Shopify import.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent-cyan">
                <Megaphone size={16} />
                <span className="text-xs font-black tracking-tight">Ad Hooks</span>
              </div>
              <p className="text-[10px] text-landing-muted leading-relaxed">Scroll-stopping hooks and UGC scripts for launch campaigns.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent-emerald">
                <Download size={16} />
                <span className="text-xs font-black tracking-tight">ZIP Export</span>
              </div>
              <p className="text-[10px] text-landing-muted leading-relaxed">Download the full store package when the build completes.</p>
            </div>
          </div>
        </div>
      </section>

      <DiscoveredProductPicker
        targetStage="commerce_creation"
        description="Import a discovered product — your form settings above will be applied."
        extraInitialInput={buildInitialInput()}
        onImport={(name) => { if (!productName) setProductName(name) }}
      />

      <section className="glass-panel p-8 rounded-[32px] border-landing-divider">
        <h3 className="text-sm font-black text-landing-primary mb-4">What you get</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: FileText, label: 'Product page', desc: 'HTML description, bullets, FAQs, SEO meta' },
            { icon: Image, label: 'Visual assets', desc: 'AI-generated product photography URLs' },
            { icon: Download, label: 'Store ZIP', desc: 'product.json, pages, images, import README' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="p-5 rounded-2xl bg-landing-surface border border-landing-divider space-y-2">
              <Icon size={18} className="text-accent-violet" />
              <p className="text-sm font-bold text-white">{label}</p>
              <p className="text-xs text-landing-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
