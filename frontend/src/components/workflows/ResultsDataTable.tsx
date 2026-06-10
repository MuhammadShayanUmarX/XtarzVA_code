import type { ReactNode } from 'react'
import { ExternalLink } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface TableColumn<T = Record<string, unknown>> {
  key: string
  label: string
  render?: (row: T) => ReactNode
  className?: string
}

interface ResultsDataTableProps<T extends Record<string, unknown>> {
  title: string
  subtitle?: string
  columns: TableColumn<T>[]
  rows: T[]
  emptyMessage?: string
  highlightKey?: string
}

export default function ResultsDataTable<T extends Record<string, unknown>>({
  title,
  subtitle,
  columns,
  rows,
  emptyMessage = 'No results found for this run.',
  highlightKey = 'is_recommended',
}: ResultsDataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] font-black text-landing-muted tracking-tight block">{title}</span>
        {subtitle && (
          <p className="text-xs text-landing-secondary mt-1">{subtitle}</p>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="p-6 rounded-2xl bg-white/[0.01] border border-landing-divider text-xs text-landing-muted italic text-center">
          {emptyMessage}
        </div>
      ) : (
        <div className="rounded-2xl border border-landing-divider overflow-hidden bg-white/[0.01]">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="text-[10px] font-black text-landing-muted tracking-tight border-b border-landing-divider bg-landing-surface/40">
                  {columns.map((col) => (
                    <th key={col.key} className={cn('p-4 whitespace-nowrap', col.className)}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs">
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={cn(
                      'border-b border-landing-divider/50 last:border-0 hover:bg-white/[0.02] transition-colors',
                      highlightKey && row[highlightKey] && 'bg-accent-amber/[0.03] border-l-2 border-l-accent-amber/40'
                    )}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={cn('p-4 text-landing-secondary font-medium', col.className)}>
                        {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export function LinkCell({ url, label = 'View' }: { url?: string; label?: string }) {
  if (!url) return <span className="text-landing-muted">—</span>
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-landing-accent hover:text-white font-bold transition-colors"
    >
      {label}
      <ExternalLink size={10} />
    </a>
  )
}
