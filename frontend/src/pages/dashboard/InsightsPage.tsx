import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Store, Search, ArrowRight, Loader2, Target, Clock,
  ChevronRight, ShieldCheck, TrendingUp, Globe
} from 'lucide-react'
import { cn } from '../../lib/utils'
import api from '../../lib/api'
import toast from 'react-hot-toast'

interface CompetitorRun {
  id: string
  name: string
  status: string
  query: string
  created_at: string
}

export default function InsightsPage() {
  const [query, setQuery] = useState('')
  const [competitorUrl, setCompetitorUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previousRuns, setPreviousRuns] = useState<CompetitorRun[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/v2/runs/')
      .then(res => {
        const runs = res.data
          .filter((r: any) =>
            r.current_stage === 'competitor_intelligence' ||
            r.engine_data?.competitor_intelligence
          )
          .map((r: any) => ({
            id: r.id,
            name: r.name,
            status: r.status,
            query: r.engine_data?.initial_input?.query || r.name,
            created_at: r.created_at,
          }))
        setPreviousRuns(runs)
      })
      .catch(() => setPreviousRuns([]))
      .finally(() => setLoadingHistory(false))
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSubmitting(true)
    try {
      const initial_input: Record<string, string> = { query: query.trim() }
      if (competitorUrl.trim()) {
        initial_input.competitor_url = competitorUrl.trim()
      }
      const res = await api.post('/v2/runs/standalone', {
        stage: 'competitor_intelligence',
        initial_input,
      })
      toast.success('Competitor research started!')
      navigate(`/dashboard/workflow?run_id=${res.data.run_id}&standalone=true`)
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to start competitor research')
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
              <Store size={24} />
            </div>
            <h1 className="text-4xl font-black text-landing-primary tracking-tight">Competitor Intel</h1>
          </div>
          <p className="text-lg text-landing-secondary font-medium leading-relaxed max-w-2xl">
            See what your competitors are doing wrong — pricing gaps, weak points, and opportunities you can exploit.
          </p>
        </div>
      </header>

      <section className="glass-panel p-8 md:p-12 rounded-[32px] border-landing-divider">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet mx-auto">
              <Target size={32} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">What competitor do you want to analyze?</h2>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-violet/20 to-accent-rose/20 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Ergonomic pet travel gear, Portable blender..."
                  className="w-full h-16 bg-landing-bg border-2 border-landing-divider focus:border-accent-violet rounded-2xl pl-6 pr-40 text-lg text-white placeholder:text-landing-muted focus:outline-none transition-all font-medium"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isSubmitting}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-accent-violet hover:bg-accent-violet/90 text-white font-black text-sm rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Analyze'}
                  {!isSubmitting && <ArrowRight size={18} />}
                </button>
              </div>
            </div>
            <input
              type="url"
              value={competitorUrl}
              onChange={(e) => setCompetitorUrl(e.target.value)}
              placeholder="Optional: competitor store URL (https://...)"
              className="w-full h-12 bg-landing-bg border border-landing-divider focus:border-accent-violet/50 rounded-xl px-5 text-sm text-white placeholder:text-landing-muted focus:outline-none transition-all"
              disabled={isSubmitting}
            />
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-landing-divider/50">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent-violet">
                <TrendingUp size={16} />
                <span className="text-xs font-black tracking-tight">Pricing Gaps</span>
              </div>
              <p className="text-[10px] text-landing-muted leading-relaxed">Find where competitors are overcharging or underdelivering.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent-rose">
                <ShieldCheck size={16} />
                <span className="text-xs font-black tracking-tight">Weakness Detection</span>
              </div>
              <p className="text-[10px] text-landing-muted leading-relaxed">Identify gaps in their product, reviews, and positioning.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent-cyan">
                <Globe size={16} />
                <span className="text-xs font-black tracking-tight">Market Saturation</span>
              </div>
              <p className="text-[10px] text-landing-muted leading-relaxed">Know if the niche is wide open or already crowded.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-lg font-black text-landing-primary tracking-tight">Previous Research</h3>
        {loadingHistory ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-landing-accent animate-spin" />
          </div>
        ) : previousRuns.length === 0 ? (
          <div className="glass-panel p-16 flex flex-col items-center justify-center text-center space-y-6 border-landing-divider min-h-[20vh]">
            <div className="w-16 h-16 rounded-3xl bg-landing-surface border border-landing-divider flex items-center justify-center text-landing-muted">
              <Search size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-landing-primary tracking-tight">No competitor research yet</h3>
              <p className="text-sm text-landing-secondary leading-relaxed max-w-md mx-auto">
                Enter a product or niche above to see what your competitors are missing.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {previousRuns.map(run => (
              <button
                key={run.id}
                onClick={() => navigate(`/dashboard/workflow?run_id=${run.id}`)}
                className="w-full glass-panel p-5 flex items-center justify-between hover:border-landing-accent/30 transition-all text-left group"
              >
                <div className="space-y-1">
                  <p className="text-sm font-bold text-landing-primary group-hover:text-white">{run.query}</p>
                  <div className="flex items-center gap-2 text-[10px] text-landing-muted font-bold">
                    <Clock size={12} />
                    {new Date(run.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'px-2.5 py-1 rounded-lg text-[10px] font-black border capitalize',
                    run.status === 'completed' ? 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20' :
                    run.status === 'running' ? 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20' :
                    'bg-landing-surface text-landing-muted border-landing-divider'
                  )}>
                    {run.status}
                  </span>
                  <ChevronRight size={16} className="text-landing-muted group-hover:text-landing-accent" />
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
