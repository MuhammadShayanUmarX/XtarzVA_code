import { useEffect, useState } from 'react'
import { Search, Target, TrendingUp, Palette, Package, Loader2 } from 'lucide-react'
import { cn } from '../../../lib/utils'
import api from '../../../lib/api'
import type { UserPreferences } from '../../../types/user'

const AGENT_META = [
  { id: 'product_intelligence', name: 'Product Intelligence', icon: Search, color: 'cyan' },
  { id: 'competitor_intelligence', name: 'Competitor Intelligence', icon: Target, color: 'rose' },
  { id: 'meta_ads_spy', name: 'Ad Creative', icon: Palette, color: 'violet' },
  { id: 'product_sourcing', name: 'Product Sourcing', icon: Package, color: 'indigo' },
  { id: 'commerce_creation', name: 'Store Builder', icon: TrendingUp, color: 'emerald' },
]

function formatPrefs(prefs: UserPreferences): string {
  const parts: string[] = []
  if (prefs.default_niches?.length) parts.push(`Niches: ${prefs.default_niches.slice(0, 2).join(', ')}`)
  if (prefs.default_budget) parts.push(`Budget: $${prefs.default_budget}`)
  if (prefs.default_margin_target) parts.push(`Margin target: ${prefs.default_margin_target}%`)
  if (prefs.default_risk) parts.push(`Risk: ${prefs.default_risk}`)
  return parts.join(' · ') || 'Default agent settings'
}

export default function AgentDefaults() {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<UserPreferences>('/v2/auth/preferences')
      .then(res => setPrefs(res.data))
      .catch(() => setPrefs(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 text-landing-accent animate-spin" />
      </div>
    )
  }

  const configLine = prefs ? formatPrefs(prefs) : 'No saved defaults yet'

  return (
    <div className="space-y-12">
      <div className="glass-panel p-10 space-y-10">
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white tracking-tight">AI Agents</h2>
          <p className="text-sm text-landing-muted">{configLine}</p>
        </div>

        <div className="space-y-4">
          {AGENT_META.map(a => (
            <div key={a.id} className="p-6 rounded-3xl bg-white/[0.01] border border-landing-divider flex items-center justify-between group hover:border-landing-divider hover:bg-white/[0.02] transition-all">
              <div className="flex items-center gap-6">
                <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110', `bg-accent-${a.color}/10 border-accent-${a.color}/20 text-accent-${a.color}`)}>
                  <a.icon size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white tracking-tight">{a.name}</h4>
                  <p className="text-xs text-landing-muted font-medium mt-1">
                    {prefs?.kill_criteria_enabled ? 'Kill criteria enabled' : 'Kill criteria off'}
                    {prefs?.default_sources?.length ? ` · Sources: ${prefs.default_sources.join(', ')}` : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-landing-muted">
          Agent defaults are set during onboarding and stored on your account. Per-run inputs can override these on each workflow page.
        </p>
      </div>
    </div>
  )
}
