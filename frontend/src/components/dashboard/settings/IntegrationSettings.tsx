import { ShoppingBag, Activity, Target, Settings, Share2 } from 'lucide-react'
import { cn } from '../../../lib/utils'

export default function IntegrationSettings() {
 const integrations = [
 { name: 'Shopify Core', status: 'connected', icon: ShoppingBag, url: 'pet-paradise-pro.myshopify.com' },
 { name: 'TikTok Ad Manager', status: 'not_connected', icon: Activity, url: 'N/A' },
 { name: 'Meta Pixel', status: 'connected', icon: Target, url: 'Pixel ID: 4829...' },
 ]

 return (
 <div className="space-y-8">
 <section className="glass-panel p-8 space-y-10">
 <div className="space-y-2">
 <h3 className="text-xl font-black text-white tracking-tight">Integrations</h3>
 <p className="text-sm text-landing-muted font-medium">Connect your store with external platforms.</p>
 </div>

 <div className="space-y-4">
 {integrations.map(int => (
 <div key={int.name} className="p-6 rounded-3xl bg-white/[0.01] border border-landing-divider flex items-center justify-between group">
 <div className="flex items-center gap-6">
 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-landing-divider flex items-center justify-center text-landing-secondary group-hover:text-white transition-colors">
 <int.icon size={20} />
 </div>
 <div>
 <h4 className="text-sm font-black text-white tracking-tight">{int.name}</h4>
 <p className="text-[11px] text-landing-muted font-medium">{int.url}</p>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <span className={cn(
"text-[9px] font-black tracking-tight px-3 py-1 rounded-full border",
 int.status === 'connected' ?"bg-accent-emerald/5 border-accent-emerald/20 text-accent-emerald" :"bg-landing-elevated border-landing-divider text-landing-muted"
 )}>
 {int.status.replace('_', ' ')}
 </span>
 <button className="text-landing-muted hover:text-white transition-colors"><Settings size={16} /></button>
 </div>
 </div>
 ))}
 </div>

 <button className="w-full h-14 rounded-2xl border-2 border-dashed border-landing-divider text-landing-muted text-xs font-black tracking-tight hover:border-landing-divider hover:text-white transition-all flex items-center justify-center gap-3">
 <Share2 size={16} /> Connect New Deployment Node
 </button>
 </section>
 </div>
 )
}
