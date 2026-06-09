import { AlertTriangle } from 'lucide-react'
import * as Switch from '@radix-ui/react-switch'

export default function SecuritySettings() {
 return (
 <div className="space-y-10">
 <section className="glass-panel p-8 space-y-10">
 <div className="space-y-2">
 <h3 className="text-xl font-black text-white tracking-tight">Security</h3>
 <p className="text-sm text-landing-muted font-medium">Manage your password and authentication.</p>
 </div>

 <div className="space-y-8">
 <div className="grid grid-cols-1 gap-6">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-landing-muted tracking-tight px-1">Current Password</label>
 <input type="password" placeholder="••••••••" className="w-full h-14 bg-white/[0.02] border border-landing-divider rounded-2xl px-6 text-sm text-white focus:outline-none focus:border-landing-accent transition-all font-bold" />
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-landing-muted tracking-tight px-1">New Password Node</label>
 <input type="password" placeholder="Min 12 characters" className="w-full h-14 bg-white/[0.02] border border-landing-divider rounded-2xl px-6 text-sm text-white focus:outline-none focus:border-landing-accent transition-all font-bold" />
 </div>
 </div>

 <div className="p-6 rounded-3xl bg-accent-amber/5 border border-accent-amber/10 flex items-center gap-4">
 <AlertTriangle size={20} className="text-accent-amber" />
 <p className="text-xs text-landing-secondary font-medium">Changing your password will terminate all active mission sessions across your devices.</p>
 </div>
 </div>

 <div className="pt-8 border-t border-landing-divider flex justify-end">
 <button className="h-14 px-10 rounded-2xl border border-landing-divider text-white text-sm font-black hover:bg-white/5 transition-all">
 Update Security Node
 </button>
 </div>
 </section>

 <section className="glass-panel p-8 space-y-8">
 <div className="flex items-center justify-between">
 <div className="space-y-1">
 <h4 className="text-lg font-black text-white tracking-tight">Two-Factor Auth</h4>
 <p className="text-xs text-landing-muted font-medium">Add an extra layer of encryption to your identity.</p>
 </div>
 <Switch.Root className="w-11 h-6 rounded-full relative bg-landing-elevated data-[state=checked]:bg-accent-emerald transition-colors outline-none cursor-default shadow-inner">
 <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-1 will-change-transform data-[state=checked]:translate-x-[1.25rem]" />
 </Switch.Root>
 </div>
 </section>
 </div>
 )
}
