export interface ProductCandidate {
  product_name: string
  platform: string
  source_url: string
  price?: string | null
  currency?: string
  demand_signal?: string | null
  category?: string | null
  snippet?: string | null
  is_recommended?: boolean
}

export interface CompetitorProfile {
  store_name: string
  store_url: string
  platform: string
  price?: string | null
  price_range?: string | null
  positioning?: string | null
  threat_level?: string | null
  is_shopify?: boolean
  notes?: string | null
}

export interface SourcingOption {
  supplier_name: string
  platform: string
  product_url: string
  price_per_unit?: number | null
  moq?: number | null
  country?: string | null
  shipping_time?: string | null
  supplier_rating?: number | null
  is_recommended?: boolean
}
