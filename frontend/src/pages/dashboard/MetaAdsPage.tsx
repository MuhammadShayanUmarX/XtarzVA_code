import { useState } from 'react'
import { Megaphone, Search, Filter, LayoutGrid, List, PlaySquare, ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function MetaAdsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [query, setQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSubmitting(true)
    try {
      const res = await api.post('/v2/runs/standalone', {
        stage: 'meta_ads_spy',
        initial_input: { query }
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
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-accent-amber/10 border border-accent-amber/20 flex items-center justify-center text-accent-amber">
              <Megaphone size={24} />
            </div>
            <h1 className="text-4xl font-black text-landing-primary tracking-tight">Meta Ad Creative</h1>
          </div>
          <p className="text-lg text-landing-secondary font-medium leading-relaxed max-w-2xl">
            Generate high-converting ad creatives, hooks, and images optimized for the Facebook & Instagram network.
          </p>
        </div>
      </header>

      {/* Input Section */}
      <section className="glass-panel p-8 md:p-12 rounded-[32px] border-landing-divider">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-black text-white tracking-tight">Generate Ad Creatives for a Product</h2>
          </div>

          <form onSubmit={handleTrack} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-amber/20 to-accent-rose/20 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Ridge Wallet, Posture Corrector..."
                className="w-full h-16 bg-landing-bg border-2 border-landing-divider focus:border-accent-amber rounded-2xl pl-6 pr-44 text-lg text-white placeholder:text-landing-muted focus:outline-none transition-all font-medium"
                disabled={isSubmitting}
              />
              <button 
                type="submit"
                disabled={!query.trim() || isSubmitting}
                className="absolute right-2 top-2 bottom-2 px-6 bg-accent-amber hover:bg-accent-amber/90 text-brand-950 font-black text-sm rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Generate Creatives'}
                {!isSubmitting && <ArrowRight size={18} />}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Advanced Toolbar */}
      <section className="flex flex-col lg:flex-row justify-between items-center gap-6 glass-panel p-4 rounded-[32px]">
        <div className="relative w-full lg:w-[480px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-landing-muted w-5 h-5" />
          <input 
            placeholder="Search generated creatives..." 
            className="w-full h-14 bg-landing-surface border border-landing-divider rounded-2xl pl-14 pr-6 text-sm text-white focus:outline-none focus:border-landing-accent transition-all font-medium" 
          />
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 h-14 bg-landing-surface border border-landing-divider rounded-2xl text-sm font-black text-landing-secondary hover:text-landing-primary transition-all">
            <Filter size={18} /> Filters
          </button>
          
          <div className="h-8 w-px bg-landing-surface hidden lg:block mx-2" />
          
          <div className="flex bg-landing-surface p-1.5 rounded-2xl border border-landing-divider">
            <button 
              onClick={() => setView('grid')} 
              className={cn(
                "w-11 h-11 flex items-center justify-center rounded-xl transition-all", 
                view === 'grid' ? "bg-landing-accent text-white" : "text-landing-muted hover:text-landing-secondary"
              )}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setView('list')} 
              className={cn(
                "w-11 h-11 flex items-center justify-center rounded-xl transition-all", 
                view === 'list' ? "bg-landing-accent text-white" : "text-landing-muted hover:text-landing-secondary"
              )}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Empty State */}
      <div className="glass-panel p-16 flex flex-col items-center justify-center text-center space-y-6 border-landing-divider min-h-[40vh]">
        <div className="w-16 h-16 rounded-3xl bg-landing-surface border border-landing-divider flex items-center justify-center text-landing-muted">
          <PlaySquare size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-landing-primary tracking-tight">No Creatives Generated</h3>
          <p className="text-sm text-landing-secondary leading-relaxed max-w-md mx-auto">
            You haven't generated any Meta ad creatives yet. Enter a product name above to generate high-converting images and copy.
          </p>
        </div>
      </div>
    </div>
  )
}
