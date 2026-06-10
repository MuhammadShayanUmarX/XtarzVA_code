import { useEffect, useState } from 'react'
import { Activity, Settings, Share2, Loader2 } from 'lucide-react'
import { cn } from '../../../lib/utils'
import api from '../../../lib/api'

interface IntegrationRow {
  name: string
  key: string
  configured: boolean
}

const LABELS: Record<string, string> = {
  langchain: 'LangChain Agents',
  gemini: 'Google Gemini',
  google: 'Google AI',
  imagen: 'Google Imagen',
  tavily: 'Tavily Search',
  apify: 'Apify Scrapers',
  firecrawl: 'Firecrawl',
  serpapi: 'SerpAPI',
  geekflare: 'Geekflare Lighthouse',
  cj_dropshipping: 'CJ Dropshipping',
  unsplash: 'Unsplash',
  shopify: 'Shopify',
}

export default function IntegrationSettings() {
  const [integrations, setIntegrations] = useState<IntegrationRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/v2/agents/integrations')
      .then(res => {
        const rows = Object.entries(res.data.integrations || {}).map(([key, configured]) => ({
          key,
          name: LABELS[key] || key,
          configured: Boolean(configured),
        }))
        setIntegrations(rows)
      })
      .catch(() => setIntegrations([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <section className="glass-panel p-8 space-y-10">
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white tracking-tight">Backend Integrations</h3>
          <p className="text-sm text-landing-muted font-medium">
            Live status from your server environment (.env). Agents run on LangChain with Google Gemini and Imagen.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-landing-accent animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {integrations.map(int => (
              <div
                key={int.key}
                className="p-6 rounded-3xl bg-white/[0.01] border border-landing-divider flex items-center justify-between group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-landing-divider flex items-center justify-center text-landing-secondary group-hover:text-white transition-colors">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white tracking-tight">{int.name}</h4>
                    <p className="text-[11px] text-landing-muted font-medium font-mono">{int.key}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    'text-[9px] font-black tracking-tight px-3 py-1 rounded-full border',
                    int.configured
                      ? 'bg-accent-emerald/5 border-accent-emerald/20 text-accent-emerald'
                      : 'bg-landing-elevated border-landing-divider text-landing-muted'
                  )}
                >
                  {int.configured ? 'configured' : 'missing'}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] text-landing-muted">
          API keys are managed in backend <code className="text-landing-secondary">.env</code> — not editable from the UI.
        </p>
      </section>
    </div>
  )
}
