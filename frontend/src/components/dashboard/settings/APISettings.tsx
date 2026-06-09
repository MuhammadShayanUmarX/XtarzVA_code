import { useState } from 'react'
import { Key, RefreshCcw, Lock, Eye, Copy } from 'lucide-react'
import * as Switch from '@radix-ui/react-switch'

export default function APISettings() {
 const [revealed, setRevealed] = useState(false)
 
 return (
 <div className="space-y-12">
 <section className="glass-panel p-10 space-y-10 relative overflow-hidden">
 <div className="absolute top-0 right-0 p-10 opacity-5">
 <Key size={120} className="text-landing-accent" />
 </div>

 <div className="space-y-4 relative z-10">
 <h2 className="text-xl font-black text-white tracking-tight">API Keys</h2>
 <p className="text-sm text-landing-muted font-medium leading-relaxed max-w-xl">
 Connect your custom apps to XtarzVA.
 </p>
 </div>

 <div className="space-y-6 relative z-10">
 <div className="flex justify-between items-center px-1">
 <label className="text-[10px] font-black text-landing-muted tracking-tight">Production Authorization Key</label>
 <button className="text-[10px] font-black text-landing-muted hover:text-white tracking-tight flex items-center gap-2 transition-all">
 <RefreshCcw size={12} /> Rotate Key
 </button>
 </div>
 <div className="group relative">
 <div className="w-full h-16 bg-black/40 border border-landing-divider rounded-2xl px-6 flex items-center justify-between font-mono text-sm group-hover:border-landing-divider transition-all shadow-inner">
 <span className="text-landing-secondary tracking-wider">
 {revealed ? 'xva_live_9f82d1c0738e4b33a5217721' : 'xva_live_••••••••••••••••••••••••'}
 </span>
 <div className="flex items-center gap-3">
 <button onClick={() => setRevealed(!revealed)} className="p-2.5 text-landing-muted hover:text-white transition-colors">{revealed ? <Lock size={18} /> : <Eye size={18} />}</button>
 <button className="p-2.5 text-landing-muted hover:text-white transition-colors"><Copy size={18} /></button>
 </div>
 </div>
 </div>
 </div>

 <div className="h-px bg-white/5" />

 <div className="space-y-8 relative z-10">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-landing-muted tracking-tight px-1">Webhook Intelligence Endpoint</label>
 <div className="flex gap-4">
 <input placeholder="https://your-nexus.io/webhooks/xtarz" className="flex-1 h-16 bg-white/[0.03] border border-landing-divider rounded-2xl px-6 text-sm text-white focus:outline-none focus:border-landing-accent transition-all font-bold" />
 <button className="px-8 h-16 border border-landing-divider rounded-2xl text-xs font-black text-landing-secondary hover:text-white hover:bg-white/[0.05] transition-all">
 Validate Target
 </button>
 </div>
 </div>
 
 <div className="space-y-4">
 <p className="text-[10px] font-black text-landing-muted tracking-tight px-1">Event Subscription Protocols</p>
 <div className="flex flex-wrap gap-8">
 {['run.completed', 'product.approved', 'listing.published', 'margin.alert'].map(e => (
 <div key={e} className="flex items-center gap-4">
 <Switch.Root className="w-11 h-6 rounded-full relative bg-landing-elevated data-[state=checked]:bg-landing-accent transition-colors outline-none cursor-default shadow-inner">
 <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-1 will-change-transform data-[state=checked]:translate-x-[1.25rem]" />
 </Switch.Root>
 <span className="text-xs font-black text-landing-secondary font-mono">{e}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>
 </div>
 )
}
