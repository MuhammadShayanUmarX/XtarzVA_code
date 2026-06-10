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

export interface MetaAdsSpyOutput {
  top_competitors_tracked: string[]
  active_ads: Array<{
    brand_name: string
    ad_copy: string
    media_type: string
    estimated_spend: number
    performance_score: number
    hook_text: string
    ad_image_url?: string
  }>
  winning_hooks: string[]
  recommended_strategy: string
  seo_titles?: string[]
  seo_meta_title?: string
  seo_meta_description?: string
  product_title?: string
  product_creative_description?: string
  product_creative_description_html?: string
  bullet_benefits?: string[]
  tags?: string[]
  faqs?: Array<{ question: string; answer: string }>
  ad_copy_hooks?: string[]
  ugc_scripts?: string[]
  creative_image_prompts?: string[]
  creative_image_urls?: string[]
}

export interface CommerceCreationOutput {
  theme_name: string
  theme_slug: string
  design_direction?: string
  settings_data?: Record<string, unknown>
  homepage_sections?: Record<string, unknown>
  theme_colors?: Record<string, string>
  hero_headline?: string
  hero_subheadline?: string
  hero_button_label?: string
  about_snippet?: string
  trust_heading?: string
  trust_points?: string[]
  testimonial_quote?: string
  testimonial_author?: string
  image_generation_prompts?: string[]
  collection_title?: string
  collection_description?: string
  hero_image_urls?: string[]
  product_image_urls?: string[]
  hero_image_assets?: string[]
  product_image_assets?: string[]
  product_handle?: string
  collection_handle?: string
  variants?: Array<{ title: string; price: string; compare_at_price?: string; sku?: string }>
}
