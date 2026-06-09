import { BarChart3, ShieldCheck, ArrowRight } from 'lucide-react'

const ANALYTICS_CARDS = [
  {
    label: 'LAUNCH ACCURACY',
    value: '97.2%',
    desc: 'Confidence rating verified across 4,200+ active product listings.',
    trend: '±0.4% Dev',
    color: 'text-landing-accent',
    sparkline: (
      <svg className="w-full h-8" viewBox="0 0 120 30" preserveAspectRatio="none">
        <path d="M 0 25 Q 30 10 60 20 T 120 5" stroke="#3E63DD" strokeWidth="1.5" fill="none" />
      </svg>
    )
  },
  {
    label: 'OPERATIONAL VELOCITY',
    value: '4m 12s',
    desc: 'Average execution duration from signal detection to live Shopify store launch.',
    trend: '-14s Delta',
    color: 'text-landing-accentSoft',
    sparkline: (
      <svg className="w-full h-8" viewBox="0 0 120 30" preserveAspectRatio="none">
        <path d="M 0 5 Q 30 20 60 10 T 120 25" stroke="#8DA4EF" strokeWidth="1.5" fill="none" />
      </svg>
    )
  },
  {
    label: 'GROWTH DELTA',
    value: '340%',
    desc: 'Average scaling margin achieved by store operators in their first 60 days.',
    trend: '+12.4% MoM',
    color: 'text-landing-accentLime',
    sparkline: (
      <svg className="w-full h-8" viewBox="0 0 120 30" preserveAspectRatio="none">
        <path d="M 0 28 Q 30 25 60 15 T 120 3" stroke="#D2F13C" strokeWidth="1.5" fill="none" />
      </svg>
    )
  }
]

const LOG_FEEDS = [
  { time: '11:34:02', event: ' tiktok_velocity_scan', status: 'COMPLETED', val: '1,240 trends audited' },
  { time: '11:34:25', event: ' competitor_margin_audit', status: 'SUCCESS', val: 'cogs = $4.12' },
  { time: '11:35:10', event: ' asset_pipeline_compile', status: 'COMPILED', val: '12 studio-renders live' },
  { time: '11:35:45', event: ' shopify_api_push', status: 'SUCCESS', val: 'sku: xtz-brush-01' }
]

export default function ResultsAnalytics() {
  return (
    <section id="results-analytics" className="py-32 bg-landing-bg relative overflow-hidden border-t border-landing-divider/10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-landing-accent">OPERATIONAL TELEMETRY</span>
          <h2 className="text-4xl md:text-5xl font-black text-landing-primary tracking-tightest mt-4">
            Results & Intelligence. <br />
            <span className="text-landing-accentLime">Verified by Data.</span>
          </h2>
          <p className="text-base text-landing-secondary max-w-2xl mx-auto mt-4">
            A premium, high-contrast, Bloomberg-inspired summary of key growth milestones and operational performance indicators.
          </p>
        </div>

        {/* Analytics Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {ANALYTICS_CARDS.map((card) => (
            <div 
              key={card.label}
              className="p-8 landing-panel border border-landing-divider/40 hover:border-landing-accent/30 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-landing-muted tracking-widest">{card.label}</span>
                  <span className={`text-[10px] font-mono font-bold ${card.color} uppercase tracking-wider`}>{card.trend}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-4xl font-black text-landing-primary tabular-nums">{card.value}</h3>
                  <div className="w-20">{card.sparkline}</div>
                </div>
              </div>
              <p className="text-xs text-landing-secondary leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Bloomberg-Style Double-Bordered Telemetry Table */}
        <div className="landing-panel overflow-hidden border border-landing-divider/40 shadow-2xl">
          <div className="px-6 py-4 bg-landing-surface/90 border-b border-landing-divider/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 text-landing-accent" />
              <span className="text-[11px] font-mono font-bold text-landing-primary uppercase tracking-widest">LIVE_OPERATIONS_FEED.log</span>
            </div>
            <div className="text-[10px] font-mono text-landing-muted font-bold">AUTO_REFRESH: ACTIVE</div>
          </div>

          {/* Double-bordered Grid */}
          <div className="p-6 overflow-x-auto">
            <div className="border-t-4 border-b-4 border-double border-landing-divider/60 py-4">
              <table className="w-full text-left font-mono text-xs text-landing-secondary min-w-[600px]">
                <thead>
                  <tr className="border-b border-landing-divider/30 text-landing-muted pb-4">
                    <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Timestamp</th>
                    <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Operation Module</th>
                    <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Status Code</th>
                    <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Telemetry Value</th>
                  </tr>
                </thead>
                <tbody>
                  {LOG_FEEDS.map((log, i) => (
                    <tr key={i} className="border-b border-landing-divider/20 hover:bg-landing-surface/20 transition-all">
                      <td className="py-3.5 text-landing-muted font-bold">{log.time}</td>
                      <td className="py-3.5 text-landing-primary font-bold">{log.event.toUpperCase()}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded bg-landing-accent/10 border border-landing-accent/20 text-[10px] text-landing-accent font-bold">
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-landing-secondary font-bold">{log.val.toUpperCase()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="px-6 py-4 bg-landing-surface/40 border-t border-landing-divider/30 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs text-landing-secondary">
              <ShieldCheck className="w-4 h-4 text-landing-accentLime" />
              <span>Full compliance audit active (SOC2 Type II validated pipeline logs).</span>
            </div>
            <button className="btn-proper-secondary text-[11px] py-2">
              Generate Detailed Report <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
