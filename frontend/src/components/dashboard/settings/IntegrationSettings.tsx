import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Wand2, Package, Megaphone, Clock } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface IntegrationCard {
  id: string
  name: string
  description: string
  icon: typeof ShoppingBag
  status: 'active' | 'coming_soon'
  href?: string
  accent: string
  accentBg: string
  accentBorder: string
}

const INTEGRATIONS: IntegrationCard[] = [
  {
    id: 'shopify',
    name: 'Shopify Sync',
    description:
      'Connect your Shopify store, build uploadable OS 2.0 themes, and publish approved products directly from your workflow runs.',
    icon: ShoppingBag,
    status: 'active',
    href: '/dashboard/shopify',
    accent: 'text-[#96bf48]',
    accentBg: 'bg-[#96bf48]/10',
    accentBorder: 'border-[#96bf48]/25',
  },
  {
    id: 'store_builder',
    name: 'Store Builder',
    description:
      'Generate branded storefront themes with product import JSON — ready to upload in Shopify Admin → Themes.',
    icon: Wand2,
    status: 'active',
    href: '/dashboard/shopify',
    accent: 'text-landing-accent',
    accentBg: 'bg-landing-accent/10',
    accentBorder: 'border-landing-accent/25',
  },
  {
    id: 'cj_dropshipping',
    name: 'CJ Dropshipping',
    description: 'Auto-sync supplier catalogs, track inventory, and map landed costs into your margin models.',
    icon: Package,
    status: 'coming_soon',
    accent: 'text-accent-emerald',
    accentBg: 'bg-accent-emerald/10',
    accentBorder: 'border-accent-emerald/20',
  },
  {
    id: 'meta_ads',
    name: 'Meta Ads',
    description: 'Push winning product creatives and ad hooks straight into your Meta Business Manager campaigns.',
    icon: Megaphone,
    status: 'coming_soon',
    accent: 'text-accent-violet',
    accentBg: 'bg-accent-violet/10',
    accentBorder: 'border-accent-violet/20',
  },
]

function StatusBadge({ status }: { status: IntegrationCard['status'] }) {
  if (status === 'active') {
    return (
      <span className="text-[9px] font-black tracking-tight px-3 py-1 rounded-full border bg-accent-emerald/5 border-accent-emerald/20 text-accent-emerald">
        available
      </span>
    )
  }
  return (
    <span className="text-[9px] font-black tracking-tight px-3 py-1 rounded-full border bg-landing-elevated border-landing-divider text-landing-muted flex items-center gap-1.5">
      <Clock size={10} />
      coming soon
    </span>
  )
}

function IntegrationCardContent({ integration }: { integration: IntegrationCard }) {
  const Icon = integration.icon

  return (
    <div className="flex items-start gap-6">
      <div
        className={cn(
          'w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0',
          integration.accentBg,
          integration.accentBorder,
          integration.accent
        )}
      >
        <Icon size={24} />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-base font-black text-white tracking-tight">{integration.name}</h4>
          <StatusBadge status={integration.status} />
        </div>
        <p className="text-sm text-landing-muted font-medium leading-relaxed">{integration.description}</p>
        {integration.status === 'active' && integration.href && (
          <span className="inline-flex items-center gap-2 text-xs font-black text-landing-accent group-hover:gap-3 transition-all">
            Open integration
            <ArrowRight size={14} />
          </span>
        )}
      </div>
    </div>
  )
}

export default function IntegrationSettings() {
  const active = INTEGRATIONS.filter(i => i.status === 'active')
  const upcoming = INTEGRATIONS.filter(i => i.status === 'coming_soon')

  return (
    <div className="space-y-8">
      <section className="glass-panel p-8 space-y-8">
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white tracking-tight">Integrations</h3>
          <p className="text-sm text-landing-muted font-medium leading-relaxed max-w-2xl">
            Connect the tools that power your dropshipping workflow. Link your Shopify store to publish listings,
            download themes, and keep your catalog in sync — no backend configuration required.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-landing-accent/10 via-transparent to-transparent border border-landing-accent/20 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-landing-accent/15 border border-landing-accent/30 flex items-center justify-center text-landing-accent">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-sm font-black text-white tracking-tight">Shopify is your launchpad</p>
              <p className="text-xs text-landing-muted font-medium">
                Head to Store Builder to connect your store and generate uploadable themes.
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/shopify"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-2xl bg-gradient-cta text-white text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
          >
            Go to Shopify Sync
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="glass-panel p-8 space-y-6">
        <p className="text-[10px] font-black text-landing-muted tracking-tight">Connected services</p>
        <div className="space-y-4">
          {active.map(integration => (
            <Link
              key={integration.id}
              to={integration.href!}
              className="block p-6 rounded-3xl bg-white/[0.01] border border-landing-divider hover:border-landing-accent/30 hover:bg-white/[0.02] transition-all group"
            >
              <IntegrationCardContent integration={integration} />
            </Link>
          ))}
        </div>
      </section>

      <section className="glass-panel p-8 space-y-6">
        <p className="text-[10px] font-black text-landing-muted tracking-tight">On the roadmap</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcoming.map(integration => (
            <div
              key={integration.id}
              className="p-6 rounded-3xl bg-white/[0.01] border border-landing-divider opacity-80"
            >
              <IntegrationCardContent integration={integration} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
