import { Search, Target, Package, TrendingUp, Megaphone, BarChart2, Zap } from 'lucide-react'
import { AgentStep } from '../types/workflow'

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
    id: 'commerce_creation',
    name: 'Store Builder',
    icon: TrendingUp,
    color: 'emerald',
    description: 'Generate SEO titles, descriptions, and ad copy for your store.',
  },
  {
    id: 'meta_ads_spy',
    name: 'Ad Creative',
    icon: Megaphone,
    color: 'violet',
    description: 'Generate scroll-stopping ad hooks and creative strategy.',
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
