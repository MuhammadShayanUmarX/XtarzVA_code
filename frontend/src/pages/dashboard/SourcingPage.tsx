import { useState } from 'react'
import { Package, Search, Filter, LayoutGrid, List, PlaySquare, ArrowRight, Loader2, DollarSign, Clock, ShieldCheck } from 'lucide-react'
import { cn } from '../../lib/utils'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function SourcingPage() {
  const [query, setQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSource = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSubmitting(true)
    try {
      const res = await api.post('/v2/runs/standalone', {
        stage: 'product_sourcing',
        initial_input: { query }
      })
      toast.success('Sourcing started!')
      // Redirect to the workflow page to see the progress, passing a param to hide the full progress bar if possible
      navigate(`/dashboard/workflow?run_id=${res.data.run_id}&standalone=true`)
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to initialize sourcing engine')
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
            <div className="w-12 h-12 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center text-accent-emerald">
              <Package size={24} />
            </div>
            <h1 className="text-4xl font-black text-landing-primary tracking-tight">Sourcing Agent</h1>
          </div>
          <p className="text-lg text-landing-secondary font-medium leading-relaxed max-w-2xl">
            Find the best suppliers on Alibaba, AliExpress, and CJ Dropshipping. Enter a product to get margin-optimized matches.
          </p>
        </div>
      </header>

      {/* Input Section */}
      <section className="glass-panel p-8 md:p-12 rounded-[32px] border-landing-divider">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center text-accent-emerald mx-auto">
              <Package size={32} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">What do you want to source?</h2>
          </div>

          <form onSubmit={handleSource} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-emerald/20 to-accent-cyan/20 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Ergonomic Desk Footrest, Portable Mini Blender..."
                className="w-full h-16 bg-landing-bg border-2 border-landing-divider focus:border-accent-emerald rounded-2xl pl-6 pr-40 text-lg text-white placeholder:text-landing-muted focus:outline-none transition-all font-medium"
                disabled={isSubmitting}
              />
              <button 
                type="submit"
                disabled={!query.trim() || isSubmitting}
                className="absolute right-2 top-2 bottom-2 px-6 bg-accent-emerald hover:bg-accent-emerald/90 text-brand-950 font-black text-sm rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Find Suppliers'}
                {!isSubmitting && <ArrowRight size={18} />}
              </button>
            </div>
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
              <p className="text-[10px] text-landing-muted leading-relaxed">Calculates estimated profit margins based on real-time COGS.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent-violet">
                <Clock size={16} />
                <span className="text-xs font-black tracking-tight">Fast Shipping</span>
              </div>
              <p className="text-[10px] text-landing-muted leading-relaxed">Prioritizes suppliers with 7-12 day shipping times to your target countries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Empty State / Previous Sourcing Results */}
      <div className="glass-panel p-16 flex flex-col items-center justify-center text-center space-y-6 border-landing-divider min-h-[30vh]">
        <div className="w-16 h-16 rounded-3xl bg-landing-surface border border-landing-divider flex items-center justify-center text-landing-muted">
          <PlaySquare size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-landing-primary tracking-tight">No Sourcing History</h3>
          <p className="text-sm text-landing-secondary leading-relaxed max-w-md mx-auto">
            You haven't sourced any products yet. Enter a product above to find the best suppliers.
          </p>
        </div>
      </div>
    </div>
  )
}
