import { Globe, ExternalLink } from 'lucide-react'

export default function StepWebResearchOutput({ output }: { output: any }) {
 const results = output?.data || []
 const count = output?.count ?? results.length

 return (
 <div>
 <p className="text-xs text-gray-500 mb-3">
 Web research — {count} source{count !== 1 ? 's' : ''} found.
 </p>

 {Array.isArray(results) && results.length > 0 ? (
 <div className="space-y-2">
 {results.slice(0, 5).map((r: any, i: number) => (
 <div key={i} className="px-3 py-2.5 rounded-lg bg-surface-overlay">
 <div className="flex items-start gap-2">
 <Globe className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
 <div className="flex-1 min-w-0">
 <a
 href={r.url}
 target="_blank"
 rel="noopener noreferrer"
 className="text-sm text-primary-lighter hover:text-primary-light flex items-center gap-1"
 >
 <span className="truncate">{r.title || r.url}</span>
 <ExternalLink className="w-3 h-3 flex-shrink-0" />
 </a>
 {r.content && (
 <p className="text-xs text-gray-400 mt-1 line-clamp-2">{r.content}</p>
 )}
 </div>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-xs text-gray-500 italic">
 No web research data (Tavily API may not be configured).
 </p>
 )}
 </div>
 )
}
