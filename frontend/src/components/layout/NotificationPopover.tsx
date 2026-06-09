import * as Popover from '@radix-ui/react-popover'
import { Bell, CheckCircle2, AlertCircle, Cpu, Zap, ArrowRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

interface Notification {
 id: string
 title: string
 description: string
 time: string
 type: 'success' | 'warning' | 'info' | 'system'
 read: boolean
}

const MOCK_NOTIFICATIONS: Notification[] = [
 {
 id: '1',
 title: 'Run Successful',
 description: 'Product scan for"Premium Smart Collars" found 14 high-confidence items.',
 time: '2m ago',
 type: 'success',
 read: false
 },
 {
 id: '2',
 title: 'System Alert',
 description: 'Optimization in progress for regional routing protocols.',
 time: '15m ago',
 type: 'warning',
 read: false
 },
 {
 id: '3',
 title: 'New Product Found',
 description: 'Found a viral breakout in the"Eco-Kitchen" niche.',
 time: '1h ago',
 type: 'info',
 read: true
 },
 {
 id: '4',
 title: 'Update Available',
 description: 'XtarzVA Core updated to v2.4.1 with efficiency improvements.',
 time: '3h ago',
 type: 'system',
 read: true
 }
]

export default function NotificationPopover() {
 return (
 <Popover.Root>
 <Popover.Trigger asChild>
 <button className="relative w-14 h-14 flex items-center justify-center text-landing-secondary hover:text-white transition-all bg-white/[0.03] rounded-2xl border border-landing-divider hover:border-white/15 group">
 <Bell size={22} className="group-hover:scale-110 transition-transform" />
 <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-landing-accent rounded-full border-2 border-landing-divider animate-pulse" />
 </button>
 </Popover.Trigger>
 
 <Popover.Portal>
 <Popover.Content 
 side="bottom" 
 align="end" 
 sideOffset={12} 
 className="w-[380px] glass-panel p-0 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-300"
 >
 <div className="p-6 border-b border-landing-divider flex items-center justify-between bg-white/[0.02]">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-lg bg-landing-accent/10 flex items-center justify-center text-landing-accent">
 <Bell size={16} />
 </div>
 <h3 className="font-black text-sm text-white tracking-tight">Notifications</h3>
 </div>
 <span className="text-[10px] font-black text-landing-muted tracking-tight bg-white/5 px-2 py-1 rounded">2 New</span>
 </div>

 <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
 {MOCK_NOTIFICATIONS.length > 0 ? (
 <div className="divide-y divide-white/5">
 {MOCK_NOTIFICATIONS.map((notif) => (
 <button 
 key={notif.id}
 className={cn(
"w-full text-left p-6 transition-all hover:bg-white/[0.03] group relative overflow-hidden",
 !notif.read &&"bg-landing-accent/[0.02]"
 )}
 >
 {!notif.read && (
 <div className="absolute left-0 top-0 bottom-0 w-1 bg-landing-accent" />
 )}
 
 <div className="flex gap-4">
 <div className={cn(
"w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
 notif.type === 'success' &&"bg-accent-emerald/10 border-accent-emerald/20 text-accent-emerald",
 notif.type === 'warning' &&"bg-accent-amber/10 border-accent-amber/20 text-accent-amber",
 notif.type === 'info' &&"bg-accent-cyan/10 border-accent-cyan/20 text-accent-cyan",
 notif.type === 'system' &&"bg-accent-violet/10 border-accent-violet/20 text-accent-violet"
 )}>
 {notif.type === 'success' && <CheckCircle2 size={18} />}
 {notif.type === 'warning' && <AlertCircle size={18} />}
 {notif.type === 'info' && <Zap size={18} />}
 {notif.type === 'system' && <Cpu size={18} />}
 </div>
 
 <div className="flex-1 space-y-1">
 <div className="flex items-center justify-between">
 <p className="text-sm font-black text-white">{notif.title}</p>
 <span className="text-[10px] font-medium text-landing-muted">{notif.time}</span>
 </div>
 <p className="text-xs text-landing-secondary leading-relaxed font-medium">
 {notif.description}
 </p>
 
 <div className="pt-2 flex items-center gap-2 text-[10px] font-black text-landing-accent tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">
 View details <ArrowRight size={12} />
 </div>
 </div>
 </div>
 </button>
 ))}
 </div>
 ) : (
 <div className="p-12 text-center space-y-4">
 <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto text-landing-muted">
 <Bell size={32} />
 </div>
 <div className="space-y-1">
 <p className="text-sm font-black text-white tracking-tight">No notifications</p>
 <p className="text-xs text-landing-muted font-medium">You're all caught up.</p>
 </div>
 </div>
 )}
 </div>

 <div className="p-4 border-t border-landing-divider">
 <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black text-landing-secondary hover:text-white tracking-tight transition-all">
 Mark all as read
 </button>
 </div>
 </Popover.Content>
 </Popover.Portal>
 </Popover.Root>
 )
}
