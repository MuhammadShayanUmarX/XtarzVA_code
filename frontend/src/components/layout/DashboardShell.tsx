import { ReactNode, useState, useEffect } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import {
 LayoutDashboard,
 History,
 Package,
 BarChart2,
 Settings,
 HelpCircle,
 ChevronLeft,
 ChevronUp,
 Search,
 Sparkles,
 LogOut,
 Menu,
 Activity,
 Store,
 Megaphone,
 Wand2
} from 'lucide-react'
import * as Popover from '@radix-ui/react-popover'
import { cn } from '../../lib/utils'
import { useUIStore } from '../../store/ui'
import { useSession } from '../../store/session'
import api from '../../lib/api'
import CommandPalette from './CommandPalette'
import NotificationPopover from './NotificationPopover'

const NAV_ITEMS = [
 { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
 { label: 'Product Discovery', icon: Sparkles, path: '/dashboard/products' },
 { label: 'Competitor Intel', icon: Store, path: '/dashboard/insights' },
 { label: 'Meta Ad Creative', icon: Megaphone, path: '/dashboard/ads' },
 { label: 'Sourcing Agent', icon: Package, path: '/dashboard/sourcing' },
 { label: 'Store Builder', icon: Wand2, path: '/dashboard/shopify' },
 { label: 'Analytics', icon: BarChart2, path: '/dashboard/analytics' },
 { label: 'Run History', icon: History, path: '/dashboard/runs' },
 { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
]

export default function DashboardShell({ children }: { children?: ReactNode }) {
 const { sidebarCollapsed, toggleSidebar } = useUIStore()
 const { clear, accessToken } = useSession()
 const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
 
 const [userInfo, setUserInfo] = useState({ email: '', name: 'Loading...', initials: '' })

 useEffect(() => {
 if (accessToken) {
 api.get('/v2/auth/me')
 .then(res => {
 const email = res.data.email || 'user@example.com'
 const name = res.data.name || res.data.full_name || email.split('@')[0]
 const initials = name.substring(0, 2).toUpperCase()
 setUserInfo({ email, name, initials })
 })
 .catch(err => {
 if (err.response?.status === 401) clear()
 })
 }
 }, [accessToken, clear])

 const location = useLocation()

 return (
 <div className="min-h-screen bg-landing-bg text-landing-primary selection:bg-landing-accent/20">
 <CommandPalette open={commandPaletteOpen} setOpen={setCommandPaletteOpen} />

 {/* Sidebar */}
 <aside
 className={cn(
"fixed left-0 top-0 h-full glass-sidebar z-40 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hidden lg:flex flex-col",
 sidebarCollapsed ?"w-24" :"w-[300px]"
 )}
 >
 {/* Sidebar Header: Workspace & Store Selector */}
 <div className="p-8 border-b border-landing-divider/30">
 <div className="flex items-center justify-between">
 <Link to="/dashboard" className="flex items-center gap-4 group">
 <div className="w-10 h-10 rounded-xl bg-landing-accent text-white flex items-center justify-center font-black text-xl shadow-sm">
 X
 </div>
 {!sidebarCollapsed && (
 <span className="font-black text-xl tracking-tighter text-white">Xtarz AI</span>
 )}
 </Link>
 </div>
 </div>

 {/* Sidebar Middle Content */}
 <div className="flex-1 flex flex-col p-6 gap-10 overflow-y-auto custom-scrollbar">
 <nav className="space-y-1.5">
 {NAV_ITEMS.map((item) => {
 const isActive = location.pathname === item.path
 return (
 <Link
 key={item.path}
 to={item.path}
 className={cn(
"nav-link-premium",
 isActive &&"active",
 sidebarCollapsed &&"justify-center px-0 h-14"
 )}
 >
 <item.icon size={20} className={cn("transition-colors", isActive ?"text-landing-accent" :"text-landing-muted")} />
 {!sidebarCollapsed && (
 <span className="flex-1 font-black text-[13px] tracking-tight">{item.label}</span>
 )}
 </Link>
 )
 })}
 </nav>

 {!sidebarCollapsed && (
 <section className="space-y-4 px-4">
 <p className="text-[10px] font-black text-landing-muted tracking-tight">Support</p>
 <div className="space-y-2">
 <button className="w-full flex items-center gap-4 py-2.5 text-xs font-black text-landing-secondary hover:text-white transition-all tracking-tight group">
 <HelpCircle size={18} className="text-landing-muted group-hover:text-landing-accent transition-colors" />
 <span>Help Center</span>
 </button>
 <button className="w-full flex items-center gap-4 py-2.5 text-xs font-black text-landing-secondary hover:text-white transition-all tracking-tight group">
 <Activity size={18} className="text-landing-muted group-hover:text-landing-accentSoft transition-colors" />
 <span>System Status</span>
 </button>
 </div>
 </section>
 )}
 </div>

 <div className="p-6 border-t border-landing-divider/30 space-y-4">
 <Popover.Root>
 <Popover.Trigger asChild>
 <button className={cn(
"w-full flex items-center p-3 rounded-[24px] transition-all hover:bg-landing-surface group text-left relative overflow-hidden",
 sidebarCollapsed ?"justify-center px-0" :"gap-4"
 )}>
 <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-landing-accent to-landing-accentSoft p-px shadow-sm">
 <div className="w-full h-full rounded-[15px] bg-landing-bg flex items-center justify-center text-white text-sm font-black uppercase">
 {userInfo.initials}
 </div>
 </div>
 {!sidebarCollapsed && (
 <>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-black text-white truncate">{userInfo.name}</p>
 <p className="text-[10px] text-landing-accent font-black tracking-tight">Active Plan</p>
 </div>
 <ChevronUp size={16} className="text-landing-muted group-hover:text-white transition-all" />
 </>
 )}
 </button>
 </Popover.Trigger>
 <Popover.Portal>
 <Popover.Content
 side={sidebarCollapsed ?"right" :"top"}
 sideOffset={16}
 className="w-[260px] glass-panel p-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-400 border-landing-divider/40"
 >
 <div className="space-y-2">
 <div className="px-3 py-2">
 <p className="text-[10px] font-black text-landing-muted tracking-tight">Account Info</p>
 <p className="text-xs font-bold text-white mt-1 truncate">{userInfo.email}</p>
 </div>
 <div className="h-px bg-landing-divider/20 mx-2" />
 <button className="w-full flex items-center gap-3 px-3 py-3 text-xs font-black text-landing-secondary hover:text-white hover:bg-landing-surface/50 rounded-xl transition-all tracking-tight">
 <Settings size={16} />
 Settings
 </button>
 <button
 onClick={() => clear()}
 className="w-full flex items-center gap-3 px-3 py-3 text-xs font-black text-[#E57373] hover:bg-[#E57373]/10 rounded-xl transition-all tracking-tight"
 >
 <LogOut size={16} />
 Sign Out
 </button>
 </div>
 </Popover.Content>
 </Popover.Portal>
 </Popover.Root>
 </div>
 </aside>

 {/* Main Container */}
 <div
 className={cn(
"transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
"lg:ml-[300px]",
 sidebarCollapsed &&"lg:ml-24",
"flex flex-col min-h-screen"
 )}
 >
 {/* Topbar: Command Bar */}
 <header className="sticky top-0 h-24 flex items-center justify-between px-10 z-30 glass-nav">
 {/* Left: Sidebar Toggle + Intelligence Search / Command Bar */}
 <div className="flex items-center gap-4 flex-1">
 <button
 onClick={() => toggleSidebar()}
 className="hidden lg:flex w-12 h-12 items-center justify-center text-landing-muted hover:text-white transition-all bg-landing-surface/40 rounded-xl border border-landing-divider/30 hover:border-landing-accent/30 group"
 title="Toggle Sidebar"
 >
 <ChevronLeft size={20} className={cn("transition-transform duration-500", sidebarCollapsed &&"rotate-180")} />
 </button>
 
 <button
 onClick={() => setCommandPaletteOpen(true)}
 className="flex items-center gap-5 flex-1 max-w-2xl h-14 px-6 bg-landing-surface/40 border border-landing-divider/30 rounded-[24px] hover:border-landing-accent/25 transition-all group text-left relative overflow-hidden"
 >
 <div className="absolute inset-0 bg-gradient-to-r from-landing-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
 <Search size={20} className="text-landing-muted group-hover:text-landing-accent transition-colors relative z-10" />
 <div className="flex-1 relative z-10">
 <span className="text-sm font-black text-landing-muted tracking-tight group-hover:text-landing-secondary transition-colors">Search products, runs, settings...</span>
 </div>
 <div className="flex items-center gap-2 relative z-10">
 <kbd className="px-2.5 py-1 rounded-lg bg-landing-bg border border-landing-divider/40 text-[10px] font-black text-landing-muted uppercase">⌘K</kbd>
 </div>
 </button>
 </div>

 {/* Right: System Tools */}
 <div className="flex items-center gap-6">
 <div className="hidden xl:flex items-center gap-2">
 <div className="w-2 h-2 rounded-full bg-status-success" />
 <p className="text-xs font-bold text-landing-secondary hover:text-white transition-colors cursor-pointer">AI Agent: Active</p>
 </div>

 <div className="w-px h-10 bg-landing-divider/25" />

 <NotificationPopover />

 <button className="w-14 h-14 flex lg:hidden items-center justify-center text-landing-muted hover:text-white transition-all bg-landing-surface/40 rounded-2xl border border-landing-divider/30">
 <Menu size={24} />
 </button>
 </div>
 </header>

 {/* Page Content */}
 <main className="flex-1 p-10 lg:p-16 relative">
 {/* Scene Noise Overlay */}
 <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
 <div className="relative z-10">
 {children || <Outlet />}
 </div>
 {/* Waitlist lock removed */}
 </main>
 </div>

 {/* Mobile Tab Bar */}
 <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 glass-nav border-t border-landing-divider/25 flex items-center justify-around z-50 px-6 pb-2">
 {NAV_ITEMS.slice(0, 4).map(item => {
 const isActive = location.pathname === item.path
 return (
 <Link key={item.path} to={item.path} className={cn(
"flex flex-col items-center gap-2 transition-all p-3 rounded-2xl",
 isActive ?"text-landing-accent bg-landing-accent/15" :"text-landing-muted"
 )}>
 <item.icon size={22} />
 <span className="text-[9px] font-black tracking-tight">{item.label.split(' ')[0]}</span>
 </Link>
 )
 })}
 </nav>
 </div>
 )
}
