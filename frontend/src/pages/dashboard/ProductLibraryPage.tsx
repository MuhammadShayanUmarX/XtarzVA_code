import { useState } from 'react'
import { Package, Sparkles, Loader2, ArrowRight } from 'lucide-react'
import api from '../../lib/api'
import { getApiErrorMessage } from '../../lib/apiErrors'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function ProductLibraryPage() {
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
     toast.error(getApiErrorMessage(err, 'Failed to initialize product discovery'))
   } finally {
     setIsSubmitting(false)
   }
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
 </div>
 )
}
