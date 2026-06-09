import { motion } from 'framer-motion'
import { CheckCircle2, Download, ChevronRight } from 'lucide-react'

export default function BillingSettings() {
 return (
 <div className="space-y-12">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
 <div className="p-10 rounded-[40px] glass-panel bg-gradient-to-br from-accent-primary/20 via-brand-900 to-brand-900 space-y-8 relative overflow-hidden border-landing-accent/30 shadow-[0_20px_60px_rgba(79,110,247,0.15)]">
 <div className="absolute -top-10 -right-10 w-40 h-40 bg-landing-accent/20 blur-[60px] pointer-events-none" />
 <div className="space-y-3">
 <div className="flex items-center gap-3">
 <span className="text-3xl font-black text-white tracking-tighter">Growth Plan</span>
 <span className="px-3 py-1 rounded-full bg-landing-accent text-[10px] font-black tracking-tight">Active</span>
 </div>
 <p className="text-landing-secondary font-bold">$149.00 / Billing Cycle</p>
 </div>
 
 <div className="space-y-4">
 <div className="flex justify-between items-end">
 <p className="text-[10px] font-black text-landing-muted tracking-tight">Run Capacity Usage</p>
 <p className="text-sm font-black text-white">7 / 10 Runs</p>
 </div>
 <div className="h-3 bg-landing-bg rounded-full overflow-hidden border border-landing-divider relative">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: '70%' }}
 transition={{ duration: 1.5, ease: 'circOut' }}
 className="h-full bg-landing-accent rounded-full" 
 />
 </div>
 </div>

 <button className="w-full h-14 bg-white text-landing-muted rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-2xl">
 Upgrade to Enterprise
 </button>
 </div>

 <div className="p-10 rounded-[40px] glass-panel space-y-10">
 <div className="space-y-4">
 <p className="text-[10px] font-black text-landing-muted tracking-tight">Protocol Payment</p>
 <div className="flex items-center gap-5 p-6 rounded-3xl bg-white/[0.02] border border-landing-divider">
 <div className="w-14 h-10 rounded-xl bg-landing-elevated border border-landing-divider flex items-center justify-center font-black text-xs text-white italic">VISA</div>
 <div className="flex-1">
 <p className="text-base font-black text-white">•••• 4242</p>
 <p className="text-xs text-landing-muted font-bold">Expires 04/2027</p>
 </div>
 <button className="p-2 text-landing-muted hover:text-white transition-colors"><ChevronRight size={20} /></button>
 </div>
 </div>
 
 <div className="pt-4">
 <p className="text-xs text-landing-muted font-medium leading-relaxed mb-6">
 Next billing event: <span className="text-white font-bold">June 14, 2025</span>
 </p>
 <button className="text-[11px] font-black text-landing-muted tracking-tight hover:text-accent-rose transition-colors">
 Terminate Subscription
 </button>
 </div>
 </div>
 </div>

 <div className="glass-panel overflow-hidden">
 <div className="p-10 border-b border-landing-divider flex items-center justify-between">
 <h3 className="text-xl font-black text-white tracking-tight">Invoice History</h3>
 <button className="text-xs font-black text-landing-muted hover:text-white transition-all tracking-tight">View Portal</button>
 </div>
 <table className="w-full">
 <thead>
 <tr className="text-[10px] font-black text-landing-muted tracking-tight text-left">
 <th className="p-8 pl-10">Billing Event</th>
 <th className="p-8">Quantum</th>
 <th className="p-8">Protocol</th>
 <th className="p-8 text-right pr-10">Asset</th>
 </tr>
 </thead>
 <tbody className="text-sm">
 {[
 { d: 'May 14, 2025', a: '$149.00', s: 'Paid' },
 { d: 'Apr 14, 2025', a: '$149.00', s: 'Paid' },
 ].map((inv, i) => (
 <tr key={i} className="border-t border-landing-divider hover:bg-white/[0.01] transition-colors">
 <td className="p-8 pl-10 text-white font-black">{inv.d}</td>
 <td className="p-8 text-landing-secondary font-black tabular-nums">{inv.a}</td>
 <td className="p-8">
 <span className="text-accent-emerald text-[10px] font-black tracking-tight flex items-center gap-2">
 <CheckCircle2 size={14} /> Settlement Complete
 </span>
 </td>
 <td className="p-8 text-right pr-10">
 <button className="w-10 h-10 rounded-xl bg-white/[0.03] border border-landing-divider flex items-center justify-center text-landing-muted hover:text-white transition-all ml-auto">
 <Download size={18} />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )
}
