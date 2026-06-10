export interface ActivityProductRow {
  name: string
  platform: string
  price?: string | null
  url?: string
  demand?: string | null
}

export interface ActivityCompetitorRow {
  store_name: string
  platform: string
  price?: string | null
  url?: string
  threat_level?: string | null
}

export interface ActivitySupplierRow {
  supplier_name: string
  platform: string
  price_per_unit?: number | null
  moq?: number | null
  country?: string | null
  url?: string
}

export interface ActivityBestSupplier {
  supplier_name: string
  platform: string
  price_per_unit?: number | null
  moq?: number | null
  country?: string | null
  url?: string
}

export interface ActivityRunSummary {
  run_id: string
  name: string
  status: string
  agent: string
  created_at: string | null
  source_run_id: string | null
  search_query: string
  product_name?: string | null
  trend_score?: number | null
  demand_score?: number | null
  estimated_margin?: number | null
  product_candidates_count: number
  top_products: ActivityProductRow[]
  competitors_count: number
  top_competitors: ActivityCompetitorRow[]
  saturation_score?: number | null
  sourcing_count: number
  best_supplier: ActivityBestSupplier | null
  top_suppliers: ActivitySupplierRow[]
  profit_margin?: number | null
  ads_count: number
  store_title?: string | null
  key_result: string
  margin_or_price: string
}

export interface ActivityTotals {
  competitors_found: number
  products_researched: number
  suppliers_found: number
  avg_margin: number | null
  avg_unit_price: number | null
}

export interface AnalyticsData {
  total_runs: number
  total_products_saved: number
  daily_scans: Array<{ date: string; runs: number; products_found: number }>
  top_niches: Array<{ name: string; run_count: number; rate: number }>
  margin_spread: Array<{ val: string; count: number }>
  mean_margin: number | null
  stage_breakdown: Record<string, number>
  completed_runs: number
  activity_runs: ActivityRunSummary[]
  totals: ActivityTotals
}
