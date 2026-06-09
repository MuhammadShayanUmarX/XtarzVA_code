import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
 User, 
 Lock, 
 CreditCard, 
 Bell, 
 Share2, 
 AlertTriangle,
 Brain,
 Key
} from 'lucide-react'
import { cn } from '../../lib/utils'

// Modular Components
import AccountSettings from '../../components/dashboard/settings/AccountSettings'
import SecuritySettings from '../../components/dashboard/settings/SecuritySettings'
import AgentDefaults from '../../components/dashboard/settings/AgentDefaults'
import BillingSettings from '../../components/dashboard/settings/BillingSettings'
import IntegrationSettings from '../../components/dashboard/settings/IntegrationSettings'
import NotificationSettings from '../../components/dashboard/settings/NotificationSettings'
import APISettings from '../../components/dashboard/settings/APISettings'
import DangerZone from '../../components/dashboard/settings/DangerZone'

const NAV_ITEMS = [
 { id: 'account', label: 'Account Profile', icon: User },
 { id: 'password', label: 'Security', icon: Lock },
 { id: 'agents', label: 'AI Agents', icon: Brain },
 { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
 { id: 'integrations', label: 'Integrations', icon: Share2 },
 { id: 'notifications', label: 'Notifications', icon: Bell },
 { id: 'api', label: 'API Keys', icon: Key },
 { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, color: 'text-accent-rose' }
]

export default function SettingsPage() {
 const [activeTab, setActiveTab] = useState('account')

 return (
 <div className="max-w-[1400px] mx-auto space-y-12 pb-32">
 {/* Header */}
 <header className="space-y-4">
 <h1 className="text-4xl font-black text-landing-primary tracking-tight">Account Settings</h1>
 <p className="text-lg text-landing-secondary font-medium leading-relaxed max-w-2xl">
 Manage your profile, billing, and AI settings.
 </p>
 </header>

 <div className="flex flex-col lg:flex-row gap-16">
 {/* Sidebar Nav */}
 <nav className="w-full lg:w-[280px] shrink-0">
 <div className="sticky top-32 space-y-2">
 {NAV_ITEMS.map(item => (
 <button 
 key={item.id}
 onClick={() => setActiveTab(item.id)}
 className={cn(
"w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-sm font-black tracking-tight group relative",
 activeTab === item.id 
 ?"bg-landing-surface text-white border border-landing-divider shadow-xl" 
 : cn("text-landing-muted hover:text-landing-secondary hover:bg-landing-surface", item.color)
 )}
 >
 {activeTab === item.id && (
 <motion.div layoutId="settings-active" className="absolute left-0 w-1 h-6 bg-landing-accent rounded-r-full" />
 )}
 <item.icon size={20} className={cn("transition-colors", activeTab === item.id ?"text-landing-accent" :"text-landing-muted group-hover:text-landing-muted", item.color)} />
 {item.label}
 </button>
 ))}
 </div>
 </nav>

 {/* Content Area */}
 <main className="flex-1 min-w-0">
 <AnimatePresence mode="wait">
 <motion.div
 key={activeTab}
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 transition={{ duration: 0.3, ease: 'easeOut' }}
 >
 {activeTab === 'account' && <AccountSettings />}
 {activeTab === 'password' && <SecuritySettings />}
 {activeTab === 'agents' && <AgentDefaults />}
 {activeTab === 'billing' && <BillingSettings />}
 {activeTab === 'integrations' && <IntegrationSettings />}
 {activeTab === 'notifications' && <NotificationSettings />}
 {activeTab === 'api' && <APISettings />}
 {activeTab === 'danger' && <DangerZone />}
 </motion.div>
 </AnimatePresence>
 </main>
 </div>
 </div>
 )
}
