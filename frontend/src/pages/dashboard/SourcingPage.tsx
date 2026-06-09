import { useState } from 'react'
import { Package, ArrowRight, Loader2, DollarSign, Clock, ShieldCheck } from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import DiscoveredProductPicker from '../../components/dashboard/DiscoveredProductPicker'

const MOQ_OPTIONS = ['Any MOQ', 'Low (1-50 units)', 'Medium (50-500)', 'High (500+)'] as const
const SHIPPING_REGIONS = ['United States', 'Europe', 'UK', 'Canada', 'Australia', 'Global'] as const

export default function SourcingPage() {
  const [productName, setProductName] = useState('')
  const [targetCost, setTargetCost] = useState('')
  const [moqPreference, setMoqPreference] = useState<string>(MOQ_OPTIONS[0])
  const [shippingRegion, setShippingRegion] = useState<string>(SHIPPING_REGIONS[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const buildInitialInput = () => ({
    query: productName.trim(),
    ...(targetCost.trim() && { target_cost: targetCost.trim() }),
    moq_preference: moqPreference,
    shipping_region: shippingRegion,
  })

  const handleSource = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productName.trim()) return

    setIsSubmitting(true)
    try {
      const res = await api.post('/v2/runs/standalone', {
        stage: 'product_sourcing',
        initial_input: buildInitialInput(),
      })
      toast.success('Sourcing started!')
      navigate(`/dashboard/workflow?run_id=${res.data.run_id}&standalone=true`)
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to initialize sourcing engine')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center text-accent-emerald">
              <Package size={24} />
            </div>
            <h1 className="text-4xl font-black text-landing-primary tracking-tight">Sourcing Agent</h1>
          </div>
          <p className="text-lg text-landing-secondary font-medium leading-relaxed max-w-2xl">
            Find margin-optimized suppliers on Alibaba, AliExpress, and CJ Dropshipping — with your cost and logistics constraints.
          </p>
        </div>
      </header>

      <section className="glass-panel p-8 md:p-12 rounded-[32px] border-landing-divider">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center text-accent-emerald mx-auto">
              <Package size={32} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Sourcing requirements</h2>
          </div>

          <form onSubmit={handleSource} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-landing-muted tracking-tight">Product name *</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Ergonomic Desk Footrest, Portable Mini Blender..."
                className="w-full h-14 bg-landing-bg border-2 border-landing-divider focus:border-accent-emerald rounded-2xl px-5 text-base text-white placeholder:text-landing-muted focus:outline-none transition-all font-medium"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-landing-muted tracking-tight">Target unit cost (optional)</label>
              <input
                type="text"
                value={targetCost}
                onChange={(e) => setTargetCost(e.target.value)}
                placeholder="e.g. under $8/unit"
                className="w-full h-12 bg-landing-bg border border-landing-divider focus:border-accent-emerald/50 rounded-xl px-5 text-sm text-white placeholder:text-landing-muted focus:outline-none transition-all"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-landing-muted tracking-tight">MOQ preference</label>
                <select
                  value={moqPreference}
                  onChange={(e) => setMoqPreference(e.target.value)}
                  className="w-full h-12 bg-landing-bg border border-landing-divider focus:border-accent-emerald/50 rounded-xl px-5 text-sm text-white focus:outline-none transition-all"
                  disabled={isSubmitting}
                >
                  {MOQ_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-landing-muted tracking-tight">Shipping region</label>
                <select
                  value={shippingRegion}
                  onChange={(e) => setShippingRegion(e.target.value)}
                  className="w-full h-12 bg-landing-bg border border-landing-divider focus:border-accent-emerald/50 rounded-xl px-5 text-sm text-white focus:outline-none transition-all"
                  disabled={isSubmitting}
                >
                  {SHIPPING_REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!productName.trim() || isSubmitting}
              className="w-full h-14 bg-accent-emerald hover:bg-accent-emerald/90 text-brand-950 font-black text-sm rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Find Suppliers'}
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-landing-divider/50">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent-emerald">
                <ShieldCheck size={16} />
                <span className="text-xs font-black tracking-tight">Vetted Quality</span>
              </div>
              <p className="text-[10px] text-landing-muted leading-relaxed">Low-rated suppliers are filtered out automatically.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent-cyan">
                <DollarSign size={16} />
                <span className="text-xs font-black tracking-tight">Margin Optimized</span>
              </div>
              <p className="text-[10px] text-landing-muted leading-relaxed">Matches suppliers against your target cost and MOQ.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent-violet">
                <Clock size={16} />
                <span className="text-xs font-black tracking-tight">Regional Shipping</span>
              </div>
              <p className="text-[10px] text-landing-muted leading-relaxed">Prioritizes suppliers with fast shipping to your region.</p>
            </div>
          </div>
        </div>
      </section>

      <DiscoveredProductPicker
        targetStage="product_sourcing"
        description="Import a product from Product Discovery to source suppliers with real product data."
        extraInitialInput={buildInitialInput()}
        onImport={(name) => { if (!productName) setProductName(name) }}
      />
    </div>
  )
}
