export default function StepIntentOutput({ output }: { output: any }) {
 const keywords: string[] = output?.keywords || []
 
 return (
 <div className="space-y-4">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
 {/* Identified Niche */}
 <div className="bg-[#f9fafb] border-[0.5px] border-[#e5e7eb] rounded-[10px] p-[14px]">
 <p className="text-[11px] uppercase font-bold text-[#9ca3af] tracking-wider mb-1">IDENTIFIED NICHE</p>
 <p className="text-[15px] font-medium text-[#111827]">{output?.niche ||"Portable tech gadgets"}</p>
 <div className="flex items-center justify-between mt-2">
 <span className="text-[12px] text-[#6b7280]">Confidence: 94%</span>
 </div>
 <div className="w-full bg-[#e5e7eb] h-1 rounded-full mt-1.5 overflow-hidden">
 <div className="bg-[#22863a] h-full" style={{ width: '94%' }} />
 </div>
 </div>

 {/* Budget Constraint */}
 <div className="bg-[#f9fafb] border-[0.5px] border-[#e5e7eb] rounded-[10px] p-[14px]">
 <p className="text-[11px] uppercase font-bold text-[#9ca3af] tracking-wider mb-1">BUDGET CONSTRAINT</p>
 <p className="text-[15px] font-medium text-[#111827]">
 {output?.budget_max ? `Under $${output.budget_max}` :"Under $40"}
 </p>
 <p className="text-[12px] text-[#6b7280] mt-1">Max price detected</p>
 </div>
 </div>

 {/* Primary Search Keywords */}
 <div className="bg-[#f9fafb] border-[0.5px] border-[#e5e7eb] rounded-[10px] p-[14px]">
 <p className="text-[11px] uppercase font-bold text-[#9ca3af] tracking-wider mb-3">PRIMARY SEARCH KEYWORDS</p>
 <div className="flex flex-wrap gap-2">
 {keywords.length > 0 ? keywords.map((kw, i) => (
 <span 
 key={i}
 className="bg-[#dcfce7] border border-[#d1e8c8] text-[#166534] text-[12px] font-medium px-2.5 py-1 rounded-full shadow-sm"
 >
 {kw}
 </span>
 )) : (
 <span className="bg-[#dcfce7] border border-[#d1e8c8] text-[#166534] text-[12px] font-medium px-2.5 py-1 rounded-full">
 portable tech
 </span>
 )}
 </div>
 </div>

 {/* Refined Research Spec */}
 <div className="bg-[#f9fafb] border-[0.5px] border-[#e5e7eb] rounded-[10px] p-[14px]">
 <p className="text-[11px] uppercase font-bold text-[#9ca3af] tracking-wider mb-1">REFINED RESEARCH SPEC</p>
 <p className="text-[13px] text-[#374151] leading-[1.6] mt-1 italic">
"{output?.refined_spec ||"Find portable tech accessories for remote workers priced under $40, focusing on high-demand items with strong TikTok presence and low competition on Google."}"
 </p>
 </div>
 </div>
 )
}
