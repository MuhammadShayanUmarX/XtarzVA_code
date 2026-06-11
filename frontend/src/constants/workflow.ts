import { Search, Target, Package, TrendingUp, Megaphone, BarChart2, Zap } from 'lucide-react'
import { AgentStep } from '../types/workflow'

/** Dashboard home route for each agent (standalone flow entry points). */
export const AGENT_HOME_PATHS: Record<string, string> = {
  product_intelligence: '/dashboard/products',
  competitor_intelligence: '/dashboard/insights',
  product_sourcing: '/dashboard/sourcing',
  meta_ads_spy: '/dashboard/ads',
  commerce_creation: '/dashboard/shopify',
}

export const WORKFLOW_AGENTS: AgentStep[] = [
  {
    id: 'product_intelligence',
    name: 'Product Discovery',
    icon: Search,
    color: 'cyan',
    description: 'Scan TikTok, Reddit, and web trends to find high-potential products.',
  },
  {
    id: 'competitor_intelligence',
    name: 'Competitor Intel',
    icon: Target,
    color: 'rose',
    description: 'Analyze competitor pricing, gaps, and market saturation.',
  },
  {
    id: 'product_sourcing',
    name: 'Sourcing',
    icon: Package,
    color: 'indigo',
    description: 'Find suppliers on Alibaba, AliExpress, and CJ Dropshipping.',
  },
  {
    id: 'meta_ads_spy',
    name: 'Ad Creative',
    icon: Megaphone,
    color: 'violet',
    description: 'SEO, product copy, tags, ad hooks, UGC scripts, and creative images.',
  },
  {
    id: 'commerce_creation',
    name: 'Store Builder',
    icon: TrendingUp,
    color: 'emerald',
    description: 'Build and download a complete uploadable Shopify theme ZIP.',
  },
  {
    id: 'auto_posting',
    name: 'Auto Posting',
    icon: Zap,
    color: 'primary',
    description: 'Automatically publish products and ads to your channels.',
    locked: true,
    lockedText: 'Coming soon',
  },
  {
    id: 'performance_monitoring',
    name: 'Performance Analytics',
    icon: BarChart2,
    color: 'amber',
    description: 'Track CTR, ROAS, and conversion metrics after launch.',
    locked: true,
    lockedText: 'Coming soon',
  },
]
