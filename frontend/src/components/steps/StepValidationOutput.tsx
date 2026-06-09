import { CheckSquare, AlertCircle } from 'lucide-react'

export default function StepValidationOutput({ output }: { output: any }) {
 const data = output?.data || {}
 const steps = data?.steps || []
 const thresholds = data?.pass_fail_thresholds || []
 const warnings = data?.warnings || []

 return (
 <div>
 <p className="text-xs text-gray-500 mb-3">
 48-hour validation plan for your top opportunities.
 </p>

 {steps.length > 0 && (
 <div className="space-y-1.5 mb-4">
 {steps.map((step: string, i: number) => (
 <div key={i} className="flex items-start gap-2.5 px-3 py-2 rounded-lg bg-surface-overlay">
 <CheckSquare className="w-4 h-4 text-primary-lighter mt-0.5 flex-shrink-0" />
 <span className="text-sm text-gray-300">{step}</span>
 </div>
 ))}
 </div>
 )}

 {thresholds.length > 0 && (
 <div className="mb-3">
 <p className="text-xs font-medium text-gray-400 mb-2">Pass/fail thresholds</p>
 <div className="space-y-1">
 {thresholds.map((t: string, i: number) => (
 <p key={i} className="text-xs text-gray-500 pl-3 border-l-2 border-surface-border">{t}</p>
 ))}
 </div>
 </div>
 )}

 {warnings.length > 0 && (
 <div>
 <p className="text-xs font-medium text-amber-400/80 mb-2">Warnings</p>
 {warnings.map((w: string, i: number) => (
 <div key={i} className="flex items-start gap-2 text-xs text-amber-400/60">
 <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
 <span>{w}</span>
 </div>
 ))}
 </div>
 )}

 {steps.length === 0 && (
 <p className="text-xs text-gray-500 italic">Validation plan generated.</p>
 )}
 </div>
 )
}
