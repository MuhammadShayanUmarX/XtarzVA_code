import { useState } from 'react'
import { Megaphone, ArrowRight, Loader2, Target, Zap, DollarSign } from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import DiscoveredProductPicker from '../../components/dashboard/DiscoveredProductPicker'

const BUDGET_TIERS = ['Testing ($10-50/day)', 'Scaling ($50-200/day)', 'Aggressive ($200+/day)'] as const
const AD_ANGLES = ['Problem/Solution', 'Social Proof', 'Before/After', 'Urgency/Scarcity', 'Lifestyle', 'Unboxing'] as const

export default function MetaAdsPage() {
  const [productName, setProductName] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [adAngle, setAdAngle] = useState<string>(AD_ANGLES[0])
  const [budgetTier, setBudgetTier] = useState<string>(BUDGET_TIERS[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productName.trim()) return

    setIsSubmitting(true)
    try {
      const res = await api.post('/v2/runs/standalone', {
        stage: 'meta_ads_spy',
        initial_input: {
          query: productName.trim(),
          target_audience: targetAudience.trim(),
          ad_angle: adAngle,
          budget_tier: budgetTier,
        },
      })
      toast.success('Ad creative generation started!')
      navigate(`/dashboard/workflow?run_id=${res.data.run_id}&standalone=true`)
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to initialize ad generator')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-accent-amber/10 border border-accent-amber/20 flex items-center justify-center text-accent-amber">
              <Megaphone size={24} />
            </div>
            <h1 className="text-4xl font-black text-landing-primary tracking-tight">Ad Creative</h1>
          </div>
          <p className="text-lg text-landing-secondary font-medium leading-relaxed max-w-2xl">
            SEO titles, product copy, Shopify tags, ad hooks, UGC scripts, and creative images — powered by Gemini and Imagen.
          </p>
        </div>
      </header>

      <section className="glass-panel p-8 md:p-12 rounded-[32px] border-landing-divider">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-black text-white tracking-tight">Campaign brief</h2>
            <p className="text-sm text-landing-muted">Generates SEO titles, meta descriptions, product copy, Shopify tags, ad hooks, UGC scripts, and creative images.</p>
          </div>

          <form onSubmit={handleTrack} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-landing-muted tracking-tight">Product *</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Ridge Wallet, Posture Corrector..."
                className="w-full h-14 bg-landing-bg border-2 border-landing-divider focus:border-accent-amber rounded-2xl px-5 text-base text-white placeholder:text-landing-muted focus:outline-none transition-all font-medium"
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
                placeholder="e.g. Men 25-40, fitness enthusiasts, urban professionals"
                className="w-full h-12 bg-landing-bg border border-landing-divider focus:border-accent-amber/50 rounded-xl px-5 text-sm text-white placeholder:text-landing-muted focus:outline-none transition-all"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-landing-muted tracking-tight">Ad angle</label>
                <select
                  value={adAngle}
                  onChange={(e) => setAdAngle(e.target.value)}
                  className="w-full h-12 bg-landing-bg border border-landing-divider focus:border-accent-amber/50 rounded-xl px-5 text-sm text-white focus:outline-none transition-all"
                  disabled={isSubmitting}
                >
                  {AD_ANGLES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-landing-muted tracking-tight">Budget tier</label>
                <select
                  value={budgetTier}
                  onChange={(e) => setBudgetTier(e.target.value)}
                  className="w-full h-12 bg-landing-bg border border-landing-divider focus:border-accent-amber/50 rounded-xl px-5 text-sm text-white focus:outline-none transition-all"
                  disabled={isSubmitting}
                >
                  {BUDGET_TIERS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!productName.trim() || isSubmitting}
              className="w-full h-14 bg-accent-amber hover:bg-accent-amber/90 text-brand-950 font-black text-sm rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Generate Creatives'}
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-landing-divider/50">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent-amber">
                <Target size={16} />
                <span className="text-xs font-black tracking-tight">Audience-Targeted</span>
              </div>
              <p className="text-[10px] text-landing-muted leading-relaxed">Hooks and copy tailored to your specific buyer persona.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent-rose">
                <Zap size={16} />
                <span className="text-xs font-black tracking-tight">Angle-Driven</span>
              </div>
              <p className="text-[10px] text-landing-muted leading-relaxed">Creatives structured around your chosen persuasion angle.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent-cyan">
                <DollarSign size={16} />
                <span className="text-xs font-black tracking-tight">Budget-Aware</span>
              </div>
              <p className="text-[10px] text-landing-muted leading-relaxed">Strategy scales to your testing or scaling budget tier.</p>
            </div>
          </div>
        </div>
      </section>

      <DiscoveredProductPicker
        targetStage="meta_ads_spy"
        title="Import from Product Discovery"
        description="Run Ad Creative on a product you already researched."
        extraInitialInput={{ brand_tone: 'Professional' }}
        onImport={(name) => setProductName(name)}
      />
    </div>
  )
}
