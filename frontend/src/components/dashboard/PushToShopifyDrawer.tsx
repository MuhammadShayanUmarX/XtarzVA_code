import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { 
 X, 
 ShoppingBag, 
 ChevronDown, 
 Loader2, 
 CheckCircle2, 
 ExternalLink,
 Info,
 DollarSign,
 Tag,
 Store
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface PushToShopifyDrawerProps {
 open: boolean
 setOpen: (open: boolean) => void
 product: {
 name: string
 price: number
 margin: number
 image: string
 } | null
}

export default function PushToShopifyDrawer({ open, setOpen, product }: PushToShopifyDrawerProps) {
 const [isPublishing, setIsPublishing] = useState(false)
 const [isSuccess, setIsSuccess] = useState(false)

 const handlePublish = async () => {
 setIsPublishing(true)
 await new Promise(r => setTimeout(r, 1500))
 setIsPublishing(false)
 setIsSuccess(true)
 }

 if (!product) return null

 return (
 <Dialog.Root open={open} onOpenChange={setOpen}>
 <Dialog.Portal>
 <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
 <Dialog.Content className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-landing-surface border-l border-landing-divider z-[110] shadow-2xl overflow-hidden flex flex-col focus:outline-none">
 
 {/* Header */}
 <header className="p-6 border-b border-landing-divider flex items-center justify-between bg-landing-surface z-10">
 <div className="flex items-center gap-3">
 <div className="p-2 rounded-lg bg-accent-emerald/10 text-accent-emerald">
 <ShoppingBag size={20} />
 </div>
 <h2 className="text-xl font-bold text-white">Push to Shopify</h2>
 </div>
 <Dialog.Close asChild>
 <button title="Close drawer" aria-label="Close push to shopify drawer" className="p-2 text-landing-muted hover:text-white transition-colors">
 <X size={20} />
 </button>
 </Dialog.Close>
 </header>

 <AnimatePresence mode="wait">
 {isSuccess ? (
 <motion.div 
 key="success"
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6"
 >
 <motion.div 
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ type: 'spring', damping: 12 }}
 className="w-20 h-20 rounded-full bg-accent-emerald/10 flex items-center justify-center text-accent-emerald border-2 border-accent-emerald/20"
 >
 <CheckCircle2 size={40} />
 </motion.div>
 <div className="space-y-2">
 <h3 className="text-2xl font-bold text-white">Published successfully!</h3>
 <p className="text-landing-secondary font-medium italic">Your product is now live on your Shopify storefront.</p>
 </div>
 <div className="flex flex-col gap-3 w-full max-w-xs pt-6">
 <button className="h-12 bg-white text-landing-muted font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
 <ExternalLink size={16} /> View in Shopify
 </button>
 <button onClick={() => setOpen(false)} className="h-12 border border-landing-divider text-landing-secondary font-bold rounded-xl hover:text-white hover:bg-white/5 transition-all">
 Back to Library
 </button>
 </div>
 </motion.div>
 ) : (
 <motion.div 
 key="form"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar"
 >
 {/* Product Summary */}
 <div className="p-4 rounded-xl bg-white/[0.02] border border-landing-divider flex gap-4">
 <img src={product.image} className="w-20 h-20 rounded-lg object-cover" alt={product.name} />
 <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
 <h4 className="text-sm font-bold text-white truncate">{product.name}</h4>
 <div className="flex items-center gap-3">
 <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent-emerald/10 text-accent-emerald tracking-tight">{product.margin}% Margin</span>
 <span className="text-xs font-bold text-landing-muted">${product.price}</span>
 </div>
 </div>
 </div>

 {/* Editable Fields */}
 <div className="space-y-6">
 <div className="space-y-2">
 <label className="text-xs font-bold text-landing-muted tracking-tight px-1">Product Title</label>
 <input defaultValue={product.name} className="w-full h-11 bg-white/5 border border-landing-divider rounded-xl px-4 text-sm text-white focus:outline-none focus:border-landing-accent transition-all font-medium" />
 <p className="text-right text-[10px] text-landing-muted">67/70 chars</p>
 </div>

 <div className="space-y-2">
 <label className="text-xs font-bold text-landing-muted tracking-tight px-1">Description</label>
 <textarea 
 rows={6}
 className="w-full bg-white/5 border border-landing-divider rounded-xl p-4 text-sm text-white focus:outline-none focus:border-landing-accent transition-all font-medium leading-relaxed resize-none"
 defaultValue="Experience ultimate comfort with this premium ergonomic desk footrest..."
 />
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-2">
 <label className="text-xs font-bold text-landing-muted tracking-tight px-1 flex items-center gap-1.5"><DollarSign size={12} /> Price</label>
 <input defaultValue={product.price} type="number" className="w-full h-11 bg-white/5 border border-landing-divider rounded-xl px-4 text-sm text-white focus:outline-none focus:border-landing-accent transition-all font-medium" />
 </div>
 <div className="space-y-2">
 <label className="text-xs font-bold text-landing-muted tracking-tight px-1 flex items-center gap-1.5">Compare-at</label>
 <input defaultValue={(product.price * 1.5).toFixed(2)} type="number" className="w-full h-11 bg-white/5 border border-landing-divider rounded-xl px-4 text-sm text-landing-muted focus:outline-none focus:border-landing-accent transition-all font-medium" />
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-xs font-bold text-landing-muted tracking-tight px-1 flex items-center gap-1.5"><Tag size={12} /> Collection</label>
 <div className="relative">
 <select className="w-full h-11 bg-white/5 border border-landing-divider rounded-xl px-4 pr-10 text-sm text-white focus:outline-none focus:border-landing-accent transition-all font-medium appearance-none">
 <option>Home Office Essentials</option>
 <option>Best Sellers</option>
 <option>New Arrivals</option>
 </select>
 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-landing-muted pointer-events-none" size={16} />
 </div>
 </div>

 <div className="pt-4 space-y-4">
 <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-landing-divider">
 <div className="flex items-center gap-3">
 <div className="p-2 rounded bg-landing-elevated text-landing-secondary">
 <Store size={14} />
 </div>
 <span className="text-xs font-bold text-white">Status: Active</span>
 </div>
 <div className="flex p-1 bg-landing-bg rounded-lg">
 {['Draft', 'Active'].map(s => (
 <button key={s} className={cn("px-3 py-1 rounded-md text-[10px] font-bold transition-all", s === 'Active' ?"bg-landing-accent text-white" :"text-landing-muted hover:text-landing-muted")}>
 {s}
 </button>
 ))}
 </div>
 </div>
 <div className="p-4 rounded-xl bg-landing-accent/[0.03] border border-landing-accent/10 flex items-start gap-3">
 <Info size={14} className="text-landing-accent shrink-0 mt-0.5" />
 <p className="text-[11px] text-landing-secondary italic">Pushing this will consume <span className="text-white font-bold">1 automator slot</span> from your current monthly run quota.</p>
 </div>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {!isSuccess && (
 <footer className="p-6 border-t border-landing-divider bg-landing-surface z-10 flex gap-3">
 <button 
 onClick={() => setOpen(false)}
 className="flex-1 h-12 border border-landing-divider rounded-xl text-sm font-bold text-landing-secondary hover:text-white transition-all"
 >
 Cancel
 </button>
 <button 
 onClick={handlePublish}
 disabled={isPublishing}
 className="flex-[2] h-12 bg-accent-emerald rounded-xl text-sm font-bold text-landing-muted transition-all flex items-center justify-center gap-2 hover:brightness-110 active:scale-95"
 >
 {isPublishing ? <Loader2 size={18} className="animate-spin" /> : <ShoppingBag size={18} />}
 {isPublishing ? 'Publishing...' : 'Publish Now →'}
 </button>
 </footer>
 )}
 </Dialog.Content>
 </Dialog.Portal>
 </Dialog.Root>
 )
}
