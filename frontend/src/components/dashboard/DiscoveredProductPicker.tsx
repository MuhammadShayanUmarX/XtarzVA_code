import { useEffect, useState } from 'react'
import { Loader2, Package, ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

interface DiscoveredProduct {
  run_id: string
  run_name: string
  status: string
  created_at: string
  product: {
    product_name: string
    product_category?: string
    trend_score?: number
    estimated_margin?: number
  }
}

interface DiscoveredProductPickerProps {
  targetStage: 'competitor_intelligence' | 'product_sourcing' | 'commerce_creation'
  title?: string
  description?: string
  className?: string
  extraInitialInput?: Record<string, string>
  onImport?: (productName: string) => void
}

const STAGE_LABELS: Record<string, string> = {
  competitor_intelligence: 'Competitor Intel',
  product_sourcing: 'Sourcing',
  commerce_creation: 'Store Builder',
}

export default function DiscoveredProductPicker({
  targetStage,
  title = 'Import from Product Discovery',
  description = 'Select a product discovered in a previous research run.',
  className,
  extraInitialInput = {},
  onImport,
}: DiscoveredProductPickerProps) {
  const [products, setProducts] = useState<DiscoveredProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/v2/runs/discovered-products')
      .then(res => setProducts(res.data.filter((p: DiscoveredProduct) => p.status === 'completed')))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const handleImport = async (sourceRunId: string, productName: string) => {
    setImporting(sourceRunId)
    onImport?.(productName)
    const initial_input = {
      ...extraInitialInput,
      query: extraInitialInput.query || productName,
    }
    try {
      const useImportEndpoint = targetStage === 'competitor_intelligence' || targetStage === 'product_sourcing'
      const res = useImportEndpoint
        ? await api.post('/v2/runs/import', { source_run_id: sourceRunId, target_stage: targetStage, initial_input })
        : await api.post('/v2/runs/standalone', {
            stage: targetStage,
            source_run_id: sourceRunId,
            initial_input,
          })
      toast.success(`Starting ${STAGE_LABELS[targetStage]}...`)
      navigate(`/dashboard/workflow?run_id=${res.data.run_id}&standalone=true`)
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Import failed')
    } finally {
      setImporting(null)
    }
  }

  if (loading) {
    return (
      <div className={cn('flex justify-center py-8', className)}>
        <Loader2 className="w-5 h-5 text-landing-accent animate-spin" />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <section className={cn('glass-panel p-8 rounded-[32px] border-landing-divider space-y-3', className)}>
        <h3 className="text-sm font-black text-landing-primary">{title}</h3>
        <p className="text-xs text-landing-muted">
          No completed product discovery runs yet. Run Product Discovery first, then import here.
        </p>
      </section>
    )
  }

  return (
    <section className={cn('glass-panel p-8 rounded-[32px] border-landing-divider space-y-6', className)}>
      <div className="space-y-1">
        <h3 className="text-sm font-black text-landing-primary">{title}</h3>
        <p className="text-xs text-landing-muted">{description}</p>
      </div>
      <div className="space-y-3">
        {products.map(item => (
          <div
            key={item.run_id}
            className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-landing-surface border border-landing-divider"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet shrink-0">
                <Package size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-landing-primary truncate">{item.product.product_name}</p>
                <p className="text-[10px] text-landing-muted">
                  {item.product.product_category || 'General'}
                  {item.product.trend_score != null && ` · Trend ${item.product.trend_score}/100`}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleImport(item.run_id, item.product.product_name)}
              disabled={!!importing}
              className="shrink-0 px-4 py-2 rounded-xl bg-landing-accent text-white text-xs font-black flex items-center gap-2 disabled:opacity-50"
            >
              {importing === item.run_id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  Import <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
