import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Calendar, ChevronDown, BarChart2, DollarSign,
  Sparkles, ChevronRight, Loader2, Package, Target, ShoppingBag
} from 'lucide-react'
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, Cell
} from 'recharts'
import * as Popover from '@radix-ui/react-popover'
import { cn } from '../../lib/utils'
import api from '../../lib/api'
import ActivityLog from '../../components/dashboard/ActivityLog'
import type { AnalyticsData } from '../../types/activity'

const RANGE_MAP: Record<string, string> = {
  'Last 7 days': '7d',
  'Last 30 days': '30d',
  'Last 90 days': '90d',
  'All Time': 'all',
}

const STAGE_LABELS: Record<string, string> = {
  product_intelligence: 'Product Research',
  competitor_intelligence: 'Competitor Intel',
  product_sourcing: 'Sourcing',
  meta_ads_spy: 'Ad Creative',
  commerce_creation: 'Store Builder',
}

const STAGE_COLORS = ['#4f6ef7', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4']

const EMPTY_ANALYTICS: AnalyticsData = {
  total_runs: 0,
  total_products_saved: 0,
  daily_scans: [],
  top_niches: [],
  margin_spread: [],
  mean_margin: null,
  stage_breakdown: {},
  completed_runs: 0,
  activity_runs: [],
  totals: {
    competitors_found: 0,
    products_researched: 0,
    suppliers_found: 0,
    avg_margin: null,
    avg_unit_price: null,
  },
}

export default function AnalyticsPage() {
  const [range, setRange] = useState('Last 7 days')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const rangeKey = RANGE_MAP[range] || '7d'
    api.get(`/v2/stats/analytics?range=${rangeKey}`)
      .then(res => setData(res.data))
      .catch(() => setData(EMPTY_ANALYTICS))
      .finally(() => setLoading(false))
  }, [range])

  const stageChart = data
    ? Object.entries(data.stage_breakdown).map(([key, count]) => ({
        name: STAGE_LABELS[key] || key,
        count,
      }))
    : []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-landing-accent animate-spin" />
      </div>
    )
  }

  const d = data!

  const kpiCards = [
    { label: 'Total Runs', value: d.total_runs, sub: 'In selected period' },
    { label: 'Completed', value: d.completed_runs, sub: 'Successful runs', accent: 'text-accent-emerald' },
    { label: 'Products Researched', value: d.totals.products_researched, sub: 'Candidate rows found', icon: Package },
    { label: 'Competitors Found', value: d.totals.competitors_found, sub: 'Across all intel runs', icon: Target },
    { label: 'Suppliers Found', value: d.totals.suppliers_found, sub: 'Sourcing options', icon: ShoppingBag },
    {
      label: 'Avg Margin',
      value: d.totals.avg_margin != null ? `${d.totals.avg_margin}%` : '—',
      sub: d.totals.avg_unit_price != null ? `Avg unit $${d.totals.avg_unit_price}` : 'From your runs',
      accent: 'text-accent-amber',
    },
  ]

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-landing-accent/10 border border-landing-accent/20 flex items-center justify-center text-landing-accent">
              <BarChart2 size={24} />
            </div>
            <h1 className="text-4xl font-black text-landing-primary tracking-tight">Performance Analytics</h1>
          </div>
          <p className="text-lg text-landing-secondary font-medium leading-relaxed max-w-2xl">
            Track scans, margins, and a full log of every product, competitor, and supplier your agents found.
          </p>
        </div>

        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="flex items-center gap-4 px-6 h-14 bg-landing-surface border border-landing-divider rounded-2xl hover:border-landing-divider transition-all text-sm font-black text-landing-primary">
              <Calendar size={18} className="text-landing-muted" />
              {range}
              <ChevronDown size={16} className="text-landing-muted" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="w-56 glass-panel p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              {Object.keys(RANGE_MAP).map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className="w-full text-left px-4 py-3 text-sm font-bold text-landing-secondary hover:text-landing-primary hover:bg-landing-surface rounded-xl transition-all"
                >
                  {r}
                </button>
              ))}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </header>

      {d.total_runs === 0 ? (
        <div className="glass-panel p-16 flex flex-col items-center justify-center text-center space-y-6 min-h-[40vh]">
          <BarChart2 size={48} className="text-landing-muted" />
          <h3 className="text-xl font-black text-landing-primary">No data yet</h3>
          <p className="text-sm text-landing-secondary max-w-md">
            Run your first product scan to start seeing analytics here.
          </p>
          <Link to="/dashboard/products" className="cta-button h-12 px-8 rounded-xl font-bold text-sm inline-flex items-center gap-2">
            Start Product Scan <ChevronRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {kpiCards.map((kpi) => (
              <div key={kpi.label} className="glass-panel p-5 space-y-2">
                <p className="text-[10px] font-black text-landing-muted tracking-tight">{kpi.label}</p>
                <p className={cn('text-2xl font-black tabular-nums', kpi.accent || 'text-landing-primary')}>
                  {kpi.value}
                </p>
                <p className="text-[10px] text-landing-muted">{kpi.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 glass-panel p-10 space-y-10 relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="text-xl font-black text-landing-primary tracking-tight">Scan Activity</h3>
                  <p className="text-[10px] font-black text-landing-muted tracking-tight mt-1">Daily scans in selected period</p>
                </div>
                <div className="flex gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-landing-accent" />
                    <span className="text-[11px] font-black text-landing-secondary tracking-tight">Scans</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-accent-emerald" />
                    <span className="text-[11px] font-black text-landing-secondary tracking-tight">Products Found</span>
                  </div>
                </div>
              </div>

              <div className="h-[400px] w-full">
                {d.daily_scans.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={d.daily_scans} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f6ef7" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#4f6ef7" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.03)" vertical={false} />
                      <XAxis dataKey="date" stroke="#3d4f6a" fontSize={11} axisLine={false} tickLine={false} dy={15} />
                      <YAxis stroke="#3d4f6a" fontSize={11} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(3, 5, 15, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px' }} />
                      <Area type="monotone" dataKey="runs" stroke="#4f6ef7" fillOpacity={1} fill="url(#colorRuns)" strokeWidth={3} />
                      <Area type="monotone" dataKey="products_found" stroke="#10b981" fillOpacity={1} fill="url(#colorProd)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-landing-muted text-sm">No scans in this period</div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass-panel p-8 space-y-6">
                <h4 className="text-sm font-black text-landing-primary tracking-tight">Summary</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-landing-secondary">Products Saved</span>
                    <span className="text-lg font-black text-landing-primary">{d.total_products_saved}</span>
                  </div>
                  {d.mean_margin !== null && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-landing-secondary">Mean Margin</span>
                      <span className="text-lg font-black text-accent-amber">{d.mean_margin}%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="glass-panel p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-black text-landing-muted tracking-tight">Products Saved</h4>
                  <Sparkles size={14} className="text-accent-violet" />
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-landing-primary tracking-tighter tabular-nums">{d.total_products_saved}</span>
                </div>
                <p className="text-xs text-landing-secondary font-medium leading-relaxed">
                  Products identified from your research runs.
                </p>
                <Link to="/dashboard/products" className="w-full h-12 rounded-xl bg-landing-surface border border-landing-divider text-xs font-black text-landing-primary hover:bg-landing-surface transition-all flex items-center justify-center gap-2">
                  View Library <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-panel p-8 space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-landing-primary tracking-tight">Profit Margins</h3>
                  <p className="text-[10px] font-black text-landing-muted tracking-tight mt-1">From your runs</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-accent-amber/10 flex items-center justify-center text-accent-amber border border-accent-amber/20">
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="h-[200px] w-full">
                {d.margin_spread.some(b => b.count > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={d.margin_spread}>
                      <XAxis dataKey="val" stroke="#3d4f6a" fontSize={10} axisLine={false} tickLine={false} unit="%" />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {d.margin_spread.map((_, i) => (
                          <Cell key={i} fill="#fbbf24" fillOpacity={0.6 + i * 0.1} />
                        ))}
                      </Bar>
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(3, 5, 15, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-landing-muted text-xs">No margin data yet</div>
                )}
              </div>
              {d.mean_margin !== null && (
                <p className="text-[11px] text-landing-muted font-medium text-center">
                  Mean margin: <span className="text-landing-primary font-black">{d.mean_margin}%</span>
                </p>
              )}
            </div>

            <div className="glass-panel p-8 space-y-10">
              <h3 className="text-lg font-black text-landing-primary tracking-tight">Activity by Stage</h3>
              <div className="h-[200px] w-full">
                {stageChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stageChart} layout="vertical">
                      <XAxis type="number" stroke="#3d4f6a" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" stroke="#3d4f6a" fontSize={10} width={100} axisLine={false} tickLine={false} />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                        {stageChart.map((_, i) => (
                          <Cell key={i} fill={STAGE_COLORS[i % STAGE_COLORS.length]} />
                        ))}
                      </Bar>
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(3, 5, 15, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-landing-muted text-xs">No stage data yet</div>
                )}
              </div>
            </div>

            <div className="glass-panel p-8 space-y-8">
              <h3 className="text-lg font-black text-landing-primary tracking-tight">Top Niches</h3>
              {d.top_niches.length === 0 ? (
                <p className="text-xs text-landing-muted">Run scans to see your top niches here.</p>
              ) : (
                <div className="space-y-6">
                  {d.top_niches.map(niche => (
                    <div key={niche.name} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-black text-landing-primary tracking-tight truncate max-w-[180px]">{niche.name}</span>
                        <span className="text-[10px] font-black text-landing-muted">{niche.run_count} run{niche.run_count !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="h-3 bg-landing-surface rounded-full overflow-hidden border border-landing-divider">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${niche.rate}%` }}
                          transition={{ duration: 1, ease: 'circOut' }}
                          className="h-full rounded-full bg-landing-accent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <ActivityLog runs={d.activity_runs} />
        </>
      )}
    </div>
  )
}
