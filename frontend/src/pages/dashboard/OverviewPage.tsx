import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  Package, Zap, Eye, ShoppingBag, ArrowUpRight, LucideIcon,
  Activity, History, Store, Megaphone, Wand2, Sparkles, ChevronRight, Loader2
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { cn } from '../../lib/utils'
import { StaggerContainer, staggerItem } from '../../components/ui/LoadingStates'
import api from '../../lib/api'

interface OverviewStats {
  total_runs: number
  products_found: number
  suppliers_sourced: number
  ads_generated: number
  competitor_scans: number
  runs_this_week: number
  completed_runs: number
  recent_runs: Array<{
    id: string
    name: string
    status: string
    current_stage: string
    query: string
    created_at: string
  }>
}

interface KPIItem {
  label: string
  value: string
  sub: string
  icon: LucideIcon
  accentColor: string
  data: { v: number }[]
}

const QUICK_ACTIONS = [
  { label: 'Find Products', desc: 'Discover winning niches', icon: Sparkles, path: '/dashboard/products', color: 'text-landing-accent' },
  { label: 'Research Competitors', desc: 'See gaps and opportunities', icon: Store, path: '/dashboard/insights', color: 'text-accent-violet' },
  { label: 'Source Suppliers', desc: 'Find the best margins', icon: Package, path: '/dashboard/sourcing', color: 'text-accent-emerald' },
  { label: 'Create Ads', desc: 'Generate scroll-stopping creatives', icon: Megaphone, path: '/dashboard/ads', color: 'text-accent-amber' },
  { label: 'Build Store', desc: 'Launch on Shopify', icon: Wand2, path: '/dashboard/shopify', color: 'text-accent-cyan' },
]

function IntelligenceModule({ kpi }: { kpi: KPIItem }) {
  return (
    <motion.div
      variants={staggerItem}
      className="glass-panel p-6 relative group flex flex-col justify-between h-[140px]"
    >
      <div className="flex items-start justify-between">
        <p className="text-[10px] text-landing-secondary font-black tracking-tight">{kpi.label}</p>
        <kpi.icon size={16} className="text-landing-muted" />
      </div>
      <div className="flex items-end justify-between mt-auto">
        <div>
          <h3 className="text-3xl font-black text-landing-primary tracking-tighter tabular-nums">{kpi.value}</h3>
          <p className="text-[10px] text-landing-muted font-bold mt-1">{kpi.sub}</p>
        </div>
        {kpi.data.length > 0 && (
          <div className="w-24 h-8 opacity-60 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpi.data}>
                <Area type="monotone" dataKey="v" stroke={kpi.accentColor} fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    completed: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20',
    running: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
    paused: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
    stopped: 'bg-landing-surface text-landing-muted border-landing-divider',
  }
  return map[status] || map.stopped
}

export default function OverviewPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<OverviewStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/v2/stats/overview')
      .then(res => setStats(res.data))
      .catch(() => setStats({
        total_runs: 0, products_found: 0, suppliers_sourced: 0,
        ads_generated: 0, competitor_scans: 0, runs_this_week: 0,
        completed_runs: 0, recent_runs: [],
      }))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-landing-accent animate-spin" />
      </div>
    )
  }

  const s = stats!
  const hasRuns = s.total_runs > 0

  const kpis: KPIItem[] = [
    { label: 'Total Scans', value: String(s.total_runs), sub: `${s.runs_this_week} this week`, icon: Eye, accentColor: '#3E63DD', data: [] },
    { label: 'Products Found', value: String(s.products_found), sub: 'From product research', icon: Zap, accentColor: '#10b981', data: [] },
    { label: 'Suppliers Sourced', value: String(s.suppliers_sourced), sub: 'Margin-optimized matches', icon: ShoppingBag, accentColor: '#f59e0b', data: [] },
    { label: 'Ads Generated', value: String(s.ads_generated), sub: 'Ready-to-run creatives', icon: Activity, accentColor: '#8b5cf6', data: [] },
  ]

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-24">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">
          {hasRuns ? 'Your Commerce Dashboard' : 'Welcome to Xtarz'}
        </h1>
        <p className="text-sm text-landing-secondary">
          {hasRuns
            ? `You've run ${s.total_runs} scan${s.total_runs !== 1 ? 's' : ''} — ${s.completed_runs} completed.`
            : 'Find winning products, beat competitors, and launch your store — all in one place.'}
        </p>
      </div>

      {hasRuns && (
        <StaggerContainer delay={0.05} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <IntelligenceModule key={kpi.label} kpi={kpi} />
          ))}
        </StaggerContainer>
      )}

      {!hasRuns ? (
        <div className="glass-panel p-12 space-y-10 border-landing-divider">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-black text-landing-primary tracking-tight">Get started in 3 steps</h2>
            <p className="text-sm text-landing-secondary max-w-lg mx-auto">
              Pick a product niche, review what the market looks like, then launch your store.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Scan the market', desc: 'Find products people are already buying' },
              { step: '2', title: 'Review & source', desc: 'Check competitors and find suppliers' },
              { step: '3', title: 'Launch your store', desc: 'Go live on Shopify with ready content' },
            ].map(item => (
              <div key={item.step} className="p-6 rounded-2xl bg-landing-surface border border-landing-divider text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-landing-accent/10 text-landing-accent font-black text-lg flex items-center justify-center mx-auto">
                  {item.step}
                </div>
                <h3 className="font-black text-landing-primary">{item.title}</h3>
                <p className="text-xs text-landing-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link to="/dashboard/products" className="cta-button h-12 px-8 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2">
              Start Your First Product Scan
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-panel p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-landing-primary tracking-tight">Recent Activity</h3>
              <Link to="/dashboard/runs" className="text-xs font-bold text-landing-accent hover:text-white flex items-center gap-1">
                View all <ChevronRight size={14} />
              </Link>
            </div>
            {s.recent_runs.length === 0 ? (
              <p className="text-sm text-landing-muted">No recent scans yet.</p>
            ) : (
              <div className="space-y-3">
                {s.recent_runs.map(run => (
                  <button
                    key={run.id}
                    onClick={() => navigate(`/dashboard/workflow?run_id=${run.id}`)}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-landing-surface border border-landing-divider hover:border-landing-accent/30 transition-all text-left group"
                  >
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-bold text-landing-primary truncate group-hover:text-white">{run.query || run.name}</p>
                      <p className="text-[10px] text-landing-muted font-bold capitalize">{run.current_stage?.replace(/_/g, ' ') || 'Scan'}</p>
                    </div>
                    <span className={cn('px-2.5 py-1 rounded-lg text-[10px] font-black border capitalize shrink-0', statusBadge(run.status))}>
                      {run.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="glass-panel p-8 space-y-6">
            <h3 className="text-lg font-black text-landing-primary tracking-tight">Quick Actions</h3>
            <div className="space-y-2">
              {QUICK_ACTIONS.map(action => (
                <Link
                  key={action.path}
                  to={action.path}
                  className="flex items-center gap-4 p-4 rounded-xl bg-landing-surface border border-landing-divider hover:border-landing-accent/30 transition-all group"
                >
                  <div className={cn('w-10 h-10 rounded-xl bg-landing-bg border border-landing-divider flex items-center justify-center', action.color)}>
                    <action.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-landing-primary group-hover:text-white">{action.label}</p>
                    <p className="text-[10px] text-landing-muted">{action.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-landing-muted group-hover:text-landing-accent" />
                </Link>
              ))}
            </div>
            <Link to="/dashboard/analytics" className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-landing-accent/10 border border-landing-accent/20 text-landing-accent text-xs font-black hover:bg-landing-accent/20 transition-all">
              <History size={14} />
              View Analytics
            </Link>
          </div>
        </div>
      )}

    </div>
  )
}
