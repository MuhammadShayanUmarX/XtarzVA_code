import { Upload } from 'lucide-react'

export default function AccountSettings() {
 return (
 <div className="space-y-10">
 <section className="glass-panel p-8 space-y-10">
 <div className="flex items-center gap-8">
 <div className="relative group cursor-pointer">
 <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-accent-primary to-accent-violet flex items-center justify-center text-white text-3xl font-black border-[4px] border-landing-divider shadow-2xl overflow-hidden relative">
 <span className="relative z-10">JD</span>
 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
 <Upload size={24} className="text-white" />
 </div>
 </div>
 </div>
 <div className="space-y-2">
 <h3 className="text-2xl font-black text-white tracking-tight">John Thorne Doe</h3>
 <p className="text-[10px] text-landing-muted font-black tracking-tight">Growth Plan Administrator</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-landing-muted tracking-tight px-1">Full Identity</label>
 <input defaultValue="John Thorne Doe" className="w-full h-14 bg-white/[0.02] border border-landing-divider rounded-2xl px-6 text-sm text-white focus:outline-none focus:border-landing-accent transition-all font-bold" />
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-landing-muted tracking-tight px-1">System Email</label>
 <input defaultValue="john@xtarzva.com" className="w-full h-14 bg-white/[0.02] border border-landing-divider rounded-2xl px-6 text-sm text-white focus:outline-none focus:border-landing-accent transition-all font-bold" />
 </div>
 </div>

 <div className="pt-8 border-t border-landing-divider flex justify-end">
 <button className="h-14 px-10 rounded-2xl bg-white text-landing-muted text-sm font-black hover:scale-105 active:scale-95 transition-all">
 Update Identity Profile
 </button>
 </div>
 </section>
 </div>
 )
}
