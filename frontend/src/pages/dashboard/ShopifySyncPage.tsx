import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Plus, ArrowRight, CheckCircle2, Clock, Activity, Loader2, PlaySquare } from 'lucide-react'
import { cn } from '../../lib/utils'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function ShopifySyncPage() {
  const [query, setQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleBuildStore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSubmitting(true)
    try {
      const res = await api.post('/v2/runs/standalone', {
        stage: 'commerce_creation',
        initial_input: { query }
      })
      toast.success('Store content generation started!')
      navigate(`/dashboard/workflow?run_id=${res.data.run_id}&standalone=true`)
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to initialize store builder')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-32">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet">
              <Wand2 size={24} />
            </div>
            <h1 className="text-4xl font-black text-landing-primary tracking-tight">Store Builder</h1>
          </div>
          <p className="text-lg text-landing-secondary font-medium leading-relaxed max-w-2xl">
            Generate SEO titles, product descriptions, bullet points, and ad hooks ready for your Shopify store.
          </p>
        </div>
      </header>

      {/* Input Section */}
      <section className="glass-panel p-8 md:p-12 rounded-[32px] border-landing-divider">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet mx-auto">
              <Wand2 size={32} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Generate Commerce Assets</h2>
          </div>

          <form onSubmit={handleBuildStore} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-violet/20 to-accent-cyan/20 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Ergonomic Desk Footrest, Portable Mini Blender..."
                className="w-full h-16 bg-landing-bg border-2 border-landing-divider focus:border-accent-violet rounded-2xl pl-6 pr-44 text-lg text-white placeholder:text-landing-muted focus:outline-none transition-all font-medium"
                disabled={isSubmitting}
              />
              <button 
                type="submit"
                disabled={!query.trim() || isSubmitting}
                className="absolute right-2 top-2 bottom-2 px-6 bg-accent-violet hover:bg-accent-violet/90 text-white font-black text-sm rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Generate Store'}
                {!isSubmitting && <ArrowRight size={18} />}
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-landing-divider/50">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent-violet">
                <CheckCircle2 size={16} />
                <span className="text-xs font-black tracking-tight">SEO Optimized</span>
              </div>
              <p className="text-[10px] text-landing-muted leading-relaxed">Generates keyword-rich titles and metadata designed to rank on Google.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent-cyan">
                <Activity size={16} />
                <span className="text-xs font-black tracking-tight">High Conversion</span>
              </div>
              <p className="text-[10px] text-landing-muted leading-relaxed">Writes emotionally compelling product descriptions and benefit bullet points.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-landing-primary">
                <Clock size={16} />
                <span className="text-xs font-black tracking-tight">Instant Deployment</span>
              </div>
              <p className="text-[10px] text-landing-muted leading-relaxed">Assets are generated instantly and formatted perfectly for Shopify sync.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Empty State / Previous Deployments */}
      <div className="glass-panel p-16 flex flex-col items-center justify-center text-center space-y-6 border-landing-divider min-h-[30vh]">
        <div className="w-16 h-16 rounded-3xl bg-landing-surface border border-landing-divider flex items-center justify-center text-landing-muted">
          <PlaySquare size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-landing-primary tracking-tight">No Store Assets Generated</h3>
          <p className="text-sm text-landing-secondary leading-relaxed max-w-md mx-auto">
            You haven't built any store pages yet. Enter a product name above to generate your first listing.
          </p>
        </div>
      </div>
    </div>
  )
}
