export default function StepGenericOutput({ output }: { output: any }) {
 if (!output || (typeof output === 'object' && Object.keys(output).length <= 1)) {
 return (
 <p className="text-xs text-gray-500 italic">Step completed successfully.</p>
 )
 }

 const display = { ...output }
 delete display.status

 return (
 <div>
 <p className="text-xs text-gray-500 mb-2">Step output:</p>
 <pre className="text-xs text-gray-400 bg-surface-overlay rounded-lg p-3 overflow-x-auto max-h-48">
 {JSON.stringify(display, null, 2)}
 </pre>
 </div>
 )
}
