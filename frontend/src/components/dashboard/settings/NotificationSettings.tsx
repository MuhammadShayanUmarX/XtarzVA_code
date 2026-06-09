import { useState } from 'react'
import { Zap, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react'
import * as Switch from '@radix-ui/react-switch'

export default function NotificationSettings() {
 const [prefs, setPrefs] = useState({
 email: true,
 push: true,
 slack: false,
 discord: true,
 mission_start: true,
 mission_complete: true,
 error_alerts: true,
 margin_alerts: true
 })

 const toggle = (key: keyof typeof prefs) => {
 setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
 }

 return (
 <div className="space-y-10">
 <section className="glass-panel p-8 space-y-10">
 <div className="space-y-2">
 <h3 className="text-xl font-black text-white tracking-tight">Notification Channels</h3>
 <p className="text-sm text-landing-muted font-medium">Configure how the XtarzVA core communicates with you.</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {[
 { id: 'email', label: 'Email Reports', desc: 'Weekly intelligence summaries.' },
 { id: 'push', label: 'Browser Push', desc: 'Real-time mission status updates.' },
 { id: 'slack', label: 'Slack Webhook', desc: 'Direct neural feed to your workspace.' },
 { id: 'discord', label: 'Discord Bot', desc: 'Operation alerts in your server.' }
 ].map(item => (
 <div key={item.id} className="p-6 rounded-3xl bg-white/[0.01] border border-landing-divider flex items-center justify-between group hover:bg-white/[0.03] transition-all">
 <div className="space-y-1">
 <p className="text-sm font-black text-white tracking-tight">{item.label}</p>
 <p className="text-[10px] text-landing-muted font-medium">{item.desc}</p>
 </div>
 <Switch.Root 
 checked={prefs[item.id as keyof typeof prefs]}
 onCheckedChange={() => toggle(item.id as keyof typeof prefs)}
 className="w-11 h-6 rounded-full relative bg-landing-elevated data-[state=checked]:bg-landing-accent transition-colors outline-none cursor-default shadow-inner"
 >
 <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-1 will-change-transform data-[state=checked]:translate-x-[1.25rem]" />
 </Switch.Root>
 </div>
 ))}
 </div>
 </section>

 <section className="glass-panel p-8 space-y-10">
 <div className="space-y-2">
 <h3 className="text-xl font-black text-white tracking-tight">Event Alerts</h3>
 <p className="text-sm text-landing-muted font-medium">Select which events trigger a notification.</p>
 </div>

 <div className="space-y-4">
 {[
 { id: 'mission_start', label: 'Operation Initialization', icon: Zap },
 { id: 'mission_complete', label: 'Data Harvest Completion', icon: CheckCircle2 },
 { id: 'error_alerts', label: 'Critical Protocol Failures', icon: AlertTriangle },
 { id: 'margin_alerts', label: 'High-Margin Opportunity Found', icon: TrendingUp }
 ].map(item => (
 <div key={item.id} className="flex items-center justify-between p-4 px-6 rounded-2xl hover:bg-white/[0.02] transition-all group">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-landing-muted group-hover:text-landing-accent transition-colors">
 <item.icon size={18} />
 </div>
 <span className="text-sm font-bold text-landing-secondary">{item.label}</span>
 </div>
 <Switch.Root 
 checked={prefs[item.id as keyof typeof prefs]}
 onCheckedChange={() => toggle(item.id as keyof typeof prefs)}
 className="w-11 h-6 rounded-full relative bg-landing-elevated data-[state=checked]:bg-landing-accent transition-colors outline-none cursor-default shadow-inner"
 >
 <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-1 will-change-transform data-[state=checked]:translate-x-[1.25rem]" />
 </Switch.Root>
 </div>
 ))}
 </div>
 </section>

 <div className="flex justify-end pt-4">
 <button className="h-14 px-10 rounded-2xl bg-white text-landing-muted text-sm font-black hover:scale-105 active:scale-95 transition-all">
 Save Alert Protocols
 </button>
 </div>
 </div>
 )
}
