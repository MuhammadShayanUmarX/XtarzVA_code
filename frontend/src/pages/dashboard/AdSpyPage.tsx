import { useState, useEffect } from 'react'
import {
  Eye, Search, ArrowRight, Loader2, Target, TrendingUp, Zap,
  Clock, ChevronRight
} from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { cn } from '../../lib/utils'
import { getApiErrorMessage } from '../../lib/apiErrors'

interface TrackedAd {
  brand_name: string
  ad_copy: string
  media_type: string
  estimated_spend: number
  performance_score: number
  hook_text: string
  ad_image_url: string
}

interface AdSpySession {
  id: string
  query: string
  brand_filter: string | null
  platform: string
  status: string
  competitors_tracked: string[]
  active_ads: TrackedAd[]
  winning_hooks: string[]
  recommended_strategy: string | null
  created_at: string
}

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook / Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'all', label: 'All platforms' },
] as const

export default function AdSpyPage() {
  const [query, setQuery] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [platform, setPlatform] = useState('facebook')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sessions, setSessions] = useState<AdSpySession[]>([])
  const [selected, setSelected] = useState<AdSpySession | null>(null)
  const [loadingHistory, setLoadingHistory] = useState(true)

  const loadSessions = () => {
    setLoadingHistory(true)
    api.get('/v2/ad-spy/sessions')
      .then((res) => {
        setSessions(res.data)
        if (res.data.length > 0 && !selected) setSelected(res.data[0])
      })
      .catch(() => setSessions([]))
      .finally(() => setLoadingHistory(false))
  }

  useEffect(() => {
    loadSessions()
  }, [])

  const handleSpy = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSubmitting(true)
    try {
      const res = await api.post('/v2/ad-spy/run', {
        query: query.trim(),
        brand_filter: brandFilter.trim() || undefined,
        platform,
      })
      toast.success('Ad spy complete!')
      setSessions((prev) => [res.data, ...prev])
      setSelected(res.data)
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Ad spy failed.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan">
              <Eye size={24} />
            </div>
            <h1 className="text-4xl font-black text-landing-primary tracking-tight">Ad Spying</h1>
          </div>
          <p className="text-lg text-landing-secondary font-medium leading-relaxed max-w-2xl">
            Track competitor ads, winning hooks, and spend patterns — then use Ad Creative to build your counter-campaign.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8">
        <div className="space-y-8">
          <section className="glass-panel p-8 md:p-12 rounded-[32px] border-landing-divider">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan mx-auto">
                  <Search size={32} />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">Spy on competitor ads</h2>
                <p className="text-sm text-landing-muted">Scans ad libraries and web research, then structures hooks, creatives, and strategy.</p>
              </div>

              <form onSubmit={handleSpy} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-landing-muted tracking-tight">Niche or product *</label>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. posture corrector, protein powder, pet grooming..."
                    className="w-full h-14 bg-landing-bg border-2 border-landing-divider focus:border-accent-cyan rounded-2xl px-5 text-base text-white placeholder:text-landing-muted focus:outline-none transition-all font-medium"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-landing-muted tracking-tight">Brand filter (optional)</label>
                    <input
                      type="text"
                      value={brandFilter}
                      onChange={(e) => setBrandFilter(e.target.value)}
                      placeholder="e.g. Gymshark, Ridge Wallet"
                      className="w-full h-12 bg-landing-bg border border-landing-divider focus:border-accent-cyan/50 rounded-xl px-5 text-sm text-white placeholder:text-landing-muted focus:outline-none"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-landing-muted tracking-tight">Platform</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full h-12 bg-landing-bg border border-landing-divider focus:border-accent-cyan/50 rounded-xl px-5 text-sm text-white focus:outline-none"
                      disabled={isSubmitting}
                    >
                      {PLATFORMS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!query.trim() || isSubmitting}
                  className="w-full h-14 bg-accent-cyan hover:bg-accent-cyan/90 text-brand-950 font-black text-sm rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Run ad spy'}
                  {!isSubmitting && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-landing-divider/50">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-accent-cyan">
                    <Target size={16} />
                    <span className="text-xs font-black tracking-tight">Live ad intel</span>
                  </div>
                  <p className="text-[10px] text-landing-muted leading-relaxed">Pulls from ad library search and competitor research.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-accent-violet">
                    <Zap size={16} />
                    <span className="text-xs font-black tracking-tight">Hook patterns</span>
                  </div>
                  <p className="text-[10px] text-landing-muted leading-relaxed">Surfaces winning hooks and creative angles in your niche.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-landing-accentLime">
                    <TrendingUp size={16} />
                    <span className="text-xs font-black tracking-tight">Counter-strategy</span>
                  </div>
                  <p className="text-[10px] text-landing-muted leading-relaxed">Get a recommended plan to beat competitor campaigns.</p>
                </div>
              </div>
            </div>
          </section>

          {selected && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white">
                  Results: {selected.query}
                </h2>
                <span className="text-xs text-landing-muted">
                  {new Date(selected.created_at).toLocaleString()}
                </span>
              </div>

              {selected.competitors_tracked.length > 0 && (
                <div className="glass-panel p-6 rounded-2xl border-landing-divider">
                  <p className="text-xs font-black text-landing-muted mb-3">Competitors tracked</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.competitors_tracked.map((c) => (
                      <span key={c} className="px-3 py-1 rounded-lg bg-landing-elevated text-xs font-bold text-white border border-landing-divider">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selected.winning_hooks.length > 0 && (
                <div className="glass-panel p-6 rounded-2xl border-landing-divider">
                  <p className="text-xs font-black text-landing-muted mb-3">Winning hooks</p>
                  <ul className="space-y-2">
                    {selected.winning_hooks.map((hook, i) => (
                      <li key={i} className="text-sm text-landing-secondary flex items-start gap-2">
                        <ChevronRight size={14} className="text-accent-cyan shrink-0 mt-0.5" />
                        {hook}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selected.recommended_strategy && (
                <div className="glass-panel p-6 rounded-2xl border-landing-accent/20 bg-landing-accent/5">
                  <p className="text-xs font-black text-landing-accent mb-2">Recommended strategy</p>
                  <p className="text-sm text-landing-secondary leading-relaxed">{selected.recommended_strategy}</p>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-xs font-black text-landing-muted">Active ads ({selected.active_ads.length})</p>
                {selected.active_ads.length === 0 ? (
                  <p className="text-sm text-landing-muted">No ads found for this query. Try a broader niche or different brand.</p>
                ) : (
                  selected.active_ads.map((ad, idx) => (
                    <div key={idx} className="glass-panel p-6 rounded-2xl border-landing-divider space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-black text-white">{ad.brand_name}</p>
                          <p className="text-[10px] text-landing-muted mt-0.5">{ad.media_type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-landing-accentLime">{ad.performance_score}/100</p>
                          <p className="text-[10px] text-landing-muted">~${ad.estimated_spend.toLocaleString()}/mo</p>
                        </div>
                      </div>
                      {ad.hook_text && (
                        <p className="text-xs font-bold text-accent-cyan">{ad.hook_text}</p>
                      )}
                      <p className="text-sm text-landing-secondary leading-relaxed">{ad.ad_copy}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl border-landing-divider sticky top-28">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-landing-muted" />
              <h3 className="text-sm font-black text-white">Spy history</h3>
            </div>
            {loadingHistory ? (
              <div className="flex items-center gap-2 text-landing-muted text-sm py-4">
                <Loader2 size={14} className="animate-spin" />
                Loading...
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-sm text-landing-muted py-4">No spy sessions yet. Run your first search above.</p>
            ) : (
              <div className="space-y-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelected(s)}
                    className={cn(
                      'w-full text-left p-4 rounded-xl border transition-all',
                      selected?.id === s.id
                        ? 'border-accent-cyan/40 bg-accent-cyan/10'
                        : 'border-landing-divider hover:border-landing-accent/20 bg-landing-bg/50'
                    )}
                  >
                    <p className="text-sm font-black text-white truncate">{s.query}</p>
                    <p className="text-[10px] text-landing-muted mt-1">
                      {s.active_ads.length} ads · {new Date(s.created_at).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
