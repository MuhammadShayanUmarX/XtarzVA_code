import { Image as ImageIcon, Camera, Palette, Copy, AlertCircle, Sparkles } from 'lucide-react'

export default function StepImageGenOutput({ output }: { output: any }) {
 const data = output?.data || output
 const visualIdentity = data?.visual_identity
 const images = data?.generated_images || []
 const prompts = visualIdentity?.mockup_prompts || []

 return (
 <div className="space-y-6">
 {/* Brand Visual Identity */}
 {visualIdentity && (
 <div className="p-5 rounded-2xl bg-surface-raised border border-surface-border">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-2">
 <Palette className="w-5 h-5 text-primary-lighter" />
 <h3 className="text-sm font-bold text-white tracking-tight">Brand Visual Blueprint</h3>
 </div>
 <span className="text-[10px] font-bold text-gray-500 uppercase px-2 py-0.5 bg-surface-overlay rounded">
 {visualIdentity.brand_aesthetic_label}
 </span>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {prompts.map((p: any, i: number) => (
 <div key={i} className="p-4 rounded-xl bg-surface-overlay border border-surface-border group hover:border-primary/30 transition-all">
 <div className="flex items-center justify-between mb-2">
 <div className="flex items-center gap-2">
 <Camera className="w-3.5 h-3.5 text-primary-lighter" />
 <span className="text-xs font-bold text-gray-200">{p.shot_type}</span>
 </div>
 <div className="flex gap-1">
 {p.style_tags?.slice(0, 2).map((tag: string, idx: number) => (
 <span key={idx} className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter border border-gray-700 px-1 py-0.5 rounded">
 {tag}
 </span>
 ))}
 </div>
 </div>
 
 <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-3 italic mb-3">
"{p.prompt}"
 </p>

 <div className="flex items-center justify-between pt-2 border-t border-surface-border">
 <div className="flex items-center gap-1.5 overflow-hidden">
 <AlertCircle className="w-3 h-3 text-red-500/50 flex-shrink-0" />
 <p className="text-[10px] text-gray-600 truncate">Neg: {p.negative_prompt}</p>
 </div>
 <button 
 onClick={() => navigator.clipboard.writeText(p.prompt)}
 className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-primary-lighter transition-colors"
 aria-label="Copy prompt"
 title="Copy prompt"
 >
 <Copy className="w-3 h-3" />
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Generated Previews */}
 <div className="space-y-3">
 <p className="text-[10px] text-gray-500 font-bold tracking-tight flex items-center gap-2">
 <Sparkles className="w-3 h-3 text-amber-400" />
 AI Generated Product Mockups
 </p>
 {images.length > 0 ? (
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
 {images.map((img: any, i: number) => (
 <div key={i} className="group relative rounded-xl bg-surface-overlay overflow-hidden border border-surface-border aspect-square">
 <img
 src={img.url}
 alt="Preview"
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
 loading="lazy"
 />
 <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
 <p className="text-[10px] text-white font-bold truncate opacity-0 group-hover:opacity-100 transition-opacity">
 {img.opportunity_title || 'Visual Concept'}
 </p>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="p-8 rounded-2xl bg-surface-overlay border border-surface-border text-center">
 <ImageIcon className="w-8 h-8 text-gray-700 mx-auto mb-3" />
 <p className="text-xs text-gray-500 italic">Pre-rendering complete. High-fidelity images will appear once API keys are active.</p>
 </div>
 )}
 </div>
 </div>
 )
}
