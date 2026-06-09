import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
 Search, 
 Filter, 
 ChevronDown, 
 LayoutGrid, 
 List, 
 X, 
 Check, 
 ShoppingBag, 
 Download, 
 Trash2,
 Bookmark,
 ExternalLink,
 ChevronRight,
 Package,
 RefreshCcw,
 Sparkles,
 TrendingUp,
 ShieldCheck,
 Zap,
 Eye,
 MoreHorizontal,
 Loader2,
 ArrowRight
} from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Slider from '@radix-ui/react-slider'
import { cn } from '../../lib/utils'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const PRODUCTS: any[] = []

export default function ProductLibraryPage() {
 const [view, setView] = useState<'grid' | 'list'>('grid')
 const [selected, setSelected] = useState<number[]>([])
 const [isFilterOpen, setIsFilterOpen] = useState(false)
 const [query, setQuery] = useState('')
 const [isSubmitting, setIsSubmitting] = useState(false)
 const navigate = useNavigate()

 const handleDiscovery = async (e: React.FormEvent) => {
   e.preventDefault()
   if (!query.trim()) return

   setIsSubmitting(true)
   try {
     const res = await api.post('/v2/runs/standalone', {
       stage: 'product_intelligence',
       initial_input: { query, category: 'General' }
     })
     toast.success('Product research started!')
     navigate(`/dashboard/workflow?run_id=${res.data.run_id}&standalone=true`)
   } catch (err: any) {
     toast.error(err.response?.data?.detail || 'Failed to initialize product discovery')
   } finally {
     setIsSubmitting(false)
   }
 }

 const toggleSelect = (id: number) => {
 setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
 }

 return (
 <div className="max-w-[1600px] mx-auto space-y-12 pb-32">
 {/* Header */}
 <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-2xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet">
 <Package size={24} />
 </div>
 <h1 className="text-4xl font-black text-landing-primary tracking-tight">Product Library</h1>
 </div>
 <p className="text-lg text-landing-secondary font-medium leading-relaxed max-w-2xl">
            Search for winning products across TikTok, Reddit, Amazon, and the web. Enter a niche or product idea to get started.
 </p>
 </div>
 
 <div className="flex items-center gap-4">
 <div className="text-right pr-6 border-r border-landing-divider hidden sm:block">
 <p className="text-[10px] font-black text-landing-muted tracking-tight">Total Products</p>
 <p className="text-sm font-black text-landing-primary">0 items</p>
 </div>
 <button className="cta-button h-14 px-8 rounded-2xl">
 <Download size={18} /> Export Data
 </button>
 </div>
 </header>

 {/* Input Section */}
 <section className="glass-panel p-8 md:p-12 rounded-[32px] border-landing-divider">
   <div className="max-w-3xl mx-auto space-y-8">
     <div className="text-center space-y-4">
       <div className="w-16 h-16 rounded-full bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet mx-auto">
         <Sparkles size={32} />
       </div>
       <h2 className="text-2xl font-black text-white tracking-tight">What niche should we explore?</h2>
     </div>

     <form onSubmit={handleDiscovery} className="relative group">
       <div className="absolute -inset-1 bg-gradient-to-r from-accent-violet/20 to-accent-cyan/20 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
       <div className="relative flex items-center">
         <input
           type="text"
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           placeholder="e.g. Home Office Gadgets, Tech Accessories, TikTok Viral..."
           className="w-full h-16 bg-landing-bg border-2 border-landing-divider focus:border-accent-violet rounded-2xl pl-6 pr-44 text-lg text-white placeholder:text-landing-muted focus:outline-none transition-all font-medium"
           disabled={isSubmitting}
         />
         <button 
           type="submit"
           disabled={!query.trim() || isSubmitting}
           className="absolute right-2 top-2 bottom-2 px-6 bg-accent-violet hover:bg-accent-violet/90 text-white font-black text-sm rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
         >
           {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Discover Products'}
           {!isSubmitting && <ArrowRight size={18} />}
         </button>
       </div>
     </form>
   </div>
 </section>

 {/* Advanced Toolbar */}
 <section className="flex flex-col lg:flex-row justify-between items-center gap-6 glass-panel p-4 rounded-[32px]">
 <div className="relative w-full lg:w-[480px]">
 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-landing-muted w-5 h-5" />
 <input 
 placeholder="Search products..." 
 className="w-full h-14 bg-landing-surface border border-landing-divider rounded-2xl pl-14 pr-6 text-sm text-white focus:outline-none focus:border-landing-accent transition-all font-medium" 
 />
 </div>
 
 <div className="flex items-center gap-4 w-full lg:w-auto">
 <button 
 onClick={() => setIsFilterOpen(true)}
 className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 h-14 bg-landing-surface border border-landing-divider rounded-2xl text-sm font-black text-landing-secondary hover:text-landing-primary transition-all"
 >
 <Filter size={18} /> Filters
 </button>
 
 <div className="h-8 w-px bg-landing-surface hidden lg:block mx-2" />
 
 <div className="flex bg-landing-surface p-1.5 rounded-2xl border border-landing-divider">
 <button 
 onClick={() => setView('grid')} 
 className={cn(
"w-11 h-11 flex items-center justify-center rounded-xl transition-all", 
 view === 'grid' ?"bg-landing-accent text-white" :"text-landing-muted hover:text-landing-secondary"
 )}
 >
 <LayoutGrid size={20} />
 </button>
 <button 
 onClick={() => setView('list')} 
 className={cn(
"w-11 h-11 flex items-center justify-center rounded-xl transition-all", 
 view === 'list' ?"bg-landing-accent text-white" :"text-landing-muted hover:text-landing-secondary"
 )}
 >
 <List size={20} />
 </button>
 </div>
 </div>
 </section>

 {/* Intelligence Grid */}
 {PRODUCTS.length === 0 ? (
  <div className="glass-panel p-16 flex flex-col items-center justify-center text-center space-y-6 border-landing-divider min-h-[40vh]">
    <div className="w-16 h-16 rounded-3xl bg-landing-surface border border-landing-divider flex items-center justify-center text-landing-muted">
      <Package size={32} />
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-black text-landing-primary tracking-tight">Library Empty</h3>
      <p className="text-sm text-landing-secondary leading-relaxed max-w-md mx-auto">
        Your product library is empty. When your autonomous agents discover and validate products, they will appear here.
      </p>
    </div>
  </div>
 ) : (
 <div className={cn(
"grid gap-8",
 view === 'grid' ?"grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" :"grid-cols-1"
 )}>
 <AnimatePresence>
 {PRODUCTS.map((prod, i) => (
 <motion.div
 key={prod.id}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: i * 0.05 }}
 onClick={() => toggleSelect(prod.id)}
 className={cn(
"group glass-panel overflow-hidden cursor-pointer transition-all duration-500",
 selected.includes(prod.id) ?"border-landing-accent ring-2 ring-accent-primary/20" :"hover:border-landing-divider",
 view === 'list' &&"flex items-center p-4 gap-8"
 )}
 >
 {/* Visual Asset */}
 <div className={cn(
"relative overflow-hidden bg-landing-elevated",
 view === 'grid' ?"h-56" :"w-32 h-32 rounded-2xl shrink-0"
 )}>
 <img 
 src={prod.image} 
 className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
 />
 <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-transparent to-transparent" />
 <div className="absolute top-4 right-4">
 <div className="w-8 h-8 rounded-lg bg-landing-bg backdrop-blur-md border border-landing-divider flex items-center justify-center text-landing-primary opacity-0 group-hover:opacity-100 transition-opacity">
 <Eye size={16} />
 </div>
 </div>
 {view === 'grid' && (
 <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
 <span className="px-2 py-1 rounded-lg bg-accent-emerald/20 border border-accent-emerald/30 text-[9px] font-black text-accent-emerald tracking-tight">
 {prod.margin}% Margin
 </span>
 <span className="text-[10px] font-black text-landing-primary bg-landing-bg backdrop-blur-md px-2 py-1 rounded-lg border border-landing-divider uppercase">
 {prod.source}
 </span>
 </div>
 )}
 </div>

 {/* Metadata */}
 <div className={cn(
"p-6 flex-1 flex flex-col justify-between",
 view === 'list' &&"p-0 pr-8"
 )}>
 <div>
 <div className="flex items-start justify-between mb-2">
 <h4 className="text-lg font-black text-landing-primary tracking-tight group-hover:text-landing-accent transition-colors truncate">
 {prod.name}
 </h4>
 {view === 'list' && (
 <span className="px-2 py-1 rounded-lg bg-accent-emerald/20 border border-accent-emerald/30 text-[9px] font-black text-accent-emerald tracking-tight">
 {prod.margin}%
 </span>
 )}
 </div>
 <div className="flex items-center gap-4">
 <div className="flex items-center gap-1.5">
 <TrendingUp size={12} className="text-accent-cyan" />
 <span className="text-[10px] font-black text-landing-muted uppercase">Trend: {prod.trend}/10</span>
 </div>
 <div className="flex items-center gap-1.5">
 <ShieldCheck size={12} className="text-accent-violet" />
 <span className="text-[10px] font-black text-landing-muted uppercase">Conf: {prod.confidence}%</span>
 </div>
 </div>
 </div>

 <div className="mt-6 pt-6 border-t border-landing-divider flex items-center justify-between">
 <div className={cn(
"flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black tracking-tight",
 prod.status === 'Published' ?"bg-accent-emerald/10 text-accent-emerald" :"bg-landing-elevated text-landing-muted"
 )}>
 <div className={cn("w-1 h-1 rounded-full", prod.status === 'Published' ?"bg-accent-emerald" :"bg-brand-600")} />
 {prod.status}
 </div>
 <button className="p-2 rounded-xl text-landing-muted hover:text-landing-primary hover:bg-landing-surface transition-all">
 <MoreHorizontal size={20} />
 </button>
 </div>
 </div>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 )}

 {/* Bulk Orchestration Bar */}
 <AnimatePresence>
 {selected.length > 0 && (
 <motion.div 
 initial={{ y: 100, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 exit={{ y: 100, opacity: 0 }}
 className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[60] w-full max-w-3xl px-6"
 >
 <div className="glass-panel border-landing-accent/40 shadow-[0_20px_80px_rgba(0,0,0,0.8)] rounded-[32px] p-5 flex items-center justify-between">
 <div className="flex items-center gap-6 pl-2">
 <div className="flex flex-col">
 <span className="text-lg font-black text-landing-primary tabular-nums">{selected.length} Products Selected</span>
 <button onClick={() => setSelected([])} className="text-[10px] font-black text-landing-muted tracking-tight text-left hover:text-landing-primary">Clear Selection</button>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <button className="cta-button h-12 px-6 rounded-2xl text-xs">
 <ShoppingBag size={16} /> Sync to Store
 </button>
 <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-landing-surface border border-landing-divider text-landing-secondary hover:text-landing-primary transition-all">
 <Download size={18} />
 </button>
 <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-accent-rose/10 border border-accent-rose/20 text-accent-rose hover:bg-accent-rose/20 transition-all">
 <Trash2 size={18} />
 </button>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 )
}
