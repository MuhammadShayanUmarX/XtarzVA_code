import { 
  FileSearch, DollarSign, Rocket, FileText, BarChart3, 
  ShoppingCart, TrendingUp, Star, Megaphone, Package,
  type LucideIcon
} from 'lucide-react'

export interface Agent {
  slug: string
  name: string
  description: string
  icon: LucideIcon
  category: string
  features: string[]
}

export const AGENTS: Agent[] = [
  { 
    slug: 'product-research', 
    name: 'Product Research', 
    description: 'Ranked product opportunities for Shopify sellers with evidence, scoring, and a 48-hour validation plan.',
    icon: FileSearch,
    category: 'Market Analysis',
    features: ['Trends (proxy)', 'Reddit signals', 'Risk flags', '48-hour validation plan']
  }
]

