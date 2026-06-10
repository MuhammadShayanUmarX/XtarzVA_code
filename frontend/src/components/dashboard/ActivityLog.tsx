import { useState } from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
import { cn } from '../../lib/utils'
import ResultsDataTable, { LinkCell } from '../workflows/ResultsDataTable'
import type { ActivityRunSummary } from '../../types/activity'

const AGENT_LABELS: Record<string, string> = {
  product_intelligence: 'Product Research',
  competitor_intelligence: 'Competitor Intel',
  product_sourcing: 'Sourcing',
  meta_ads_spy: 'Ad Creative',
  commerce_creation: 'Store Builder',
}

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'product_intelligence', label: 'Research' },
  { id: 'competitor_intelligence', label: 'Competitors' },
  { id: 'product_sourcing', label: 'Sourcing' },
  { id: 'meta_ads_spy', label: 'Ads' },
  { id: 'commerce_creation', label: 'Store' },
]

function statusClass(status: string) {
  const map: Record<string, string> = {
    completed: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20',
    running: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
    failed: 'bg-accent-rose/10 text-accent-rose border-accent-rose/20',
    paused: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
    stopped: 'bg-landing-surface text-landing-muted border-landing-divider',
  }
  return map[status] || map.stopped
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function RunDetailPanel({ run }: { run: ActivityRunSummary }) {
  const agent = run.agent

  if (agent === 'product_intelligence' && run.top_products.length > 0) {
    return (
      <ResultsDataTable
        title="Discovered Products"
        columns={[
          { key: 'name', label: 'Product', render: (r) => <span className="font-bold text-white">{r.name}</span> },
          { key: 'platform', label: 'Platform' },
          { key: 'price', label: 'Price', render: (r) => r.price || '—' },
          { key: 'demand', label: 'Demand', render: (r) => r.demand || '—' },
          { key: 'url', label: 'Link', render: (r) => <LinkCell url={r.url} /> },
        ]}
        rows={run.top_products}
        emptyMessage="No product rows for this run."
        highlightKey=""
      />
    )
  }

  if (agent === 'competitor_intelligence' && run.top_competitors.length > 0) {
    return (
      <ResultsDataTable
        title="Competitor Stores"
        columns={[
          { key: 'store_name', label: 'Store', render: (r) => <span className="font-bold text-white">{r.store_name}</span> },
          { key: 'platform', label: 'Platform' },
          { key: 'price', label: 'Price', render: (r) => r.price || '—' },
          { key: 'threat_level', label: 'Threat', render: (r) => r.threat_level || '—' },
          { key: 'url', label: 'Link', render: (r) => <LinkCell url={r.url} /> },
        ]}
        rows={run.top_competitors}
        emptyMessage="No competitor rows for this run."
        highlightKey=""
      />
    )
  }

  if (agent === 'product_sourcing' && run.top_suppliers.length > 0) {
    return (
      <ResultsDataTable
        title="Sourcing Options"
        columns={[
          { key: 'supplier_name', label: 'Supplier', render: (r) => <span className="font-bold text-white">{r.supplier_name}</span> },
          { key: 'platform', label: 'Platform' },
          { key: 'country', label: 'Country', render: (r) => r.country || '—' },
          { key: 'moq', label: 'MOQ', render: (r) => (r.moq != null ? `${r.moq}` : '—') },
          { key: 'price_per_unit', label: 'Unit Price', render: (r) => (r.price_per_unit != null ? `$${r.price_per_unit}` : '—') },
          { key: 'url', label: 'Link', render: (r) => <LinkCell url={r.url} /> },
        ]}
        rows={run.top_suppliers}
        emptyMessage="No supplier rows for this run."
        highlightKey=""
      />
    )
  }

  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-landing-divider text-xs text-landing-secondary space-y-2">
      {run.product_name && <p><span className="text-landing-muted">Product:</span> {run.product_name}</p>}
      {run.profit_margin != null && <p><span className="text-landing-muted">Margin:</span> {run.profit_margin}%</p>}
      {run.saturation_score != null && <p><span className="text-landing-muted">Saturation:</span> {run.saturation_score}/100</p>}
      {run.ads_count > 0 && <p><span className="text-landing-muted">Ads generated:</span> {run.ads_count}</p>}
      {run.store_title && <p><span className="text-landing-muted">Store title:</span> {run.store_title}</p>}
      {!run.product_name && !run.store_title && run.ads_count === 0 && (
        <p className="italic text-landing-muted">No detailed rows saved for this run. Open the full report for more.</p>
      )}
    </div>
  )
}

interface ActivityLogProps {
  runs: ActivityRunSummary[]
}

export default function ActivityLog({ runs }: ActivityLogProps) {
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = filter === 'all' ? runs : runs.filter((r) => r.agent === filter)

  return (
    <div className="glass-panel p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-landing-primary tracking-tight">Activity Log</h3>
          <p className="text-xs text-landing-secondary mt-1">
            Every search, product, competitor, and supplier from your runs.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all',
                filter === tab.id
                  ? 'bg-landing-accent/20 border-landing-accent/40 text-landing-primary'
                  : 'bg-landing-surface border-landing-divider text-landing-muted hover:text-landing-primary'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-landing-muted text-center py-8">No activity in this filter for the selected period.</p>
      ) : (
        <div className="rounded-2xl border border-landing-divider overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="text-[10px] font-black text-landing-muted tracking-tight border-b border-landing-divider bg-landing-surface/40">
                  <th className="p-4 w-8" />
                  <th className="p-4">Date</th>
                  <th className="p-4">Search Query</th>
                  <th className="p-4">Agent</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Key Result</th>
                  <th className="p-4">Margin / Price</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {filtered.map((run) => {
                  const isOpen = expandedId === run.run_id
                  const hasDetail =
                    run.top_products.length > 0 ||
                    run.top_competitors.length > 0 ||
                    run.top_suppliers.length > 0 ||
                    run.product_name ||
                    run.store_title ||
                    run.ads_count > 0

                  return (
                    <Fragment key={run.run_id}>
                      <tr
                        className="border-b border-landing-divider/50 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="p-4">
                          {hasDetail && (
                            <button
                              type="button"
                              onClick={() => setExpandedId(isOpen ? null : run.run_id)}
                              className="text-landing-muted hover:text-landing-primary"
                              aria-label={isOpen ? 'Collapse' : 'Expand'}
                            >
                              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                          )}
                        </td>
                        <td className="p-4 text-landing-secondary whitespace-nowrap">{formatDate(run.created_at)}</td>
                        <td className="p-4 text-white font-bold max-w-[160px] truncate" title={run.search_query}>
                          {run.search_query || '—'}
                        </td>
                        <td className="p-4 text-landing-secondary whitespace-nowrap">
                          {AGENT_LABELS[run.agent] || run.agent}
                        </td>
                        <td className="p-4">
                          <span className={cn('px-2 py-0.5 rounded text-[9px] font-black uppercase border', statusClass(run.status))}>
                            {run.status}
                          </span>
                        </td>
                        <td className="p-4 text-landing-secondary max-w-[200px] truncate" title={run.key_result}>
                          {run.key_result}
                        </td>
                        <td className="p-4 text-landing-primary font-black whitespace-nowrap">{run.margin_or_price}</td>
                        <td className="p-4 text-right">
                          <Link
                            to={`/dashboard/workflow?run_id=${run.run_id}&standalone=true`}
                            className="inline-flex items-center gap-1 text-landing-accent font-bold hover:text-white transition-colors"
                          >
                            Report <ExternalLink size={10} />
                          </Link>
                        </td>
                      </tr>
                      {isOpen && hasDetail && (
                        <tr className="bg-white/[0.01] border-b border-landing-divider/50">
                          <td colSpan={8} className="p-6">
                            <RunDetailPanel run={run} />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
