import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radar, Scale, Rocket, ArrowRight, Search } from 'lucide-react'

const STEPS = [
  {
    id: '01',
    label: 'Signal Detection',
    title: 'Cognitive Trend Harvesting',
    icon: Radar,
    accent: '#3E63DD',
    body: 'The OS scans multiple high-intent signals in parallel—tiktok product velocity, forum sentiment index, and competitor density curves—to surface raw opportunities.',
    stat: '1,240 signals/sec',
    json: {
      status_code: "200_OK",
      timestamp: "11:37:02",
      active_signals: [
        { source: "TikTok_Velocity", growth_delta: "+94.2%", state: "CRITICAL_MASS" },
        { source: "Reddit_Sentiment", density: "2.3k mentions", state: "HIGH_MOMENTUM" },
        { source: "Google_Trends", query_velocity: "Rising", state: "OUTRANGED" }
      ],
      market_density_index: 0.12,
      evaluation: "SURFACE_OPPORTUNITY"
    }
  },
  {
    id: '02',
    label: 'Margin Auditing',
    title: 'Multi-Signal Profit Audit',
    icon: Scale,
    accent: '#8DA4EF',
    body: 'Profit Architect auto-models total landed cost (COGS, packing, estimated shipping, platform processing fees). Kill criteria drops any item failing the 60% mark.',
    stat: '±2.3% Accuracy',
    json: {
      status_code: "200_OK",
      timestamp: "11:37:15",
      financials: {
        product_cogs: 4.12,
        air_freight_est: 5.20,
        shopify_fees: 1.12,
        suggested_retail: 34.99
      },
      margin_evaluation: {
        net_margin_percentage: 62.4,
        kill_criteria_passing: true
      },
      audit_gate: "APPROVED"
    }
  },
  {
    id: '03',
    label: 'Store Synchronization',
    title: 'Automated Store Orchestration',
    icon: Rocket,
    accent: '#D2F13C',
    body: 'Creative Director renders lifestyle assets while SEO Strategist writes high-conversion description copies. The listing gets published straight to your Shopify admin.',
    stat: 'Sub-5 Min Sync',
    json: {
      status_code: "200_OK",
      timestamp: "11:37:25",
      assets_generated: {
        lifestyle_renders: 12,
        optimized_ad_variants: 2,
        seo_meta_score: "98/100"
      },
      shopify_gateway: {
        sync_payload_hash: "0x8F9E12B4",
        push_status: "SUCCESSFUL_PUBLISH",
        endpoint: "/products/self-cleaning-brush"
      }
    }
  },
]

export default function InteractiveHowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section id="how-it-works" className="py-32 bg-landing-bg relative overflow-hidden border-t border-landing-divider/10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-landing-accent">OPERATIONAL PIPELINE</span>
          <h2 className="text-4xl md:text-5xl font-black text-landing-primary tracking-tightest mt-4">
            Automated Operations. <br />
            <span className="text-landing-accent">Step-by-Step Transparency.</span>
          </h2>
          <p className="text-base text-landing-secondary max-w-2xl mx-auto mt-4">
            Click any step to inspect the structured data payloads generated during each phase of the product launch.
          </p>
        </div>

        {/* Telemetry Toggle Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            const isActive = activeStep === i
            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(i)}
                className={`p-8 landing-panel border cursor-pointer hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between ${
                  isActive 
                    ? 'border-landing-accent/50 bg-landing-surface/80 shadow-lg' 
                    : 'border-landing-divider/20 opacity-80 hover:opacity-100 hover:border-landing-divider/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded bg-landing-surface border border-landing-divider/30 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-landing-accent" />
                    </div>
                    <span className="text-sm font-mono font-bold text-landing-muted">[{step.id}]</span>
                  </div>
                  <p className="text-[10px] font-mono font-bold text-landing-accent uppercase tracking-wider mb-2">{step.label}</p>
                  <h3 className="text-lg font-bold text-landing-primary mb-3">{step.title}</h3>
                  <p className="text-xs text-landing-secondary leading-relaxed mb-6">{step.body}</p>
                </div>
                <div className="pt-6 border-t border-landing-divider/20 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-landing-muted uppercase font-bold tracking-widest">PERFORMANCE</span>
                  <span className="text-landing-primary font-bold">{step.stat}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* High-Fidelity JSON Payload Console */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-8 landing-panel border border-landing-accent/30 shadow-2xl relative"
          >
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-landing-divider/20">
              <div className="w-10 h-10 rounded bg-landing-accent/10 border border-landing-accent/20 flex items-center justify-center">
                <Search className="w-5 h-5 text-landing-accent" />
              </div>
              <div>
                <p className="text-[9px] font-mono font-bold text-landing-accent uppercase tracking-wider">PIPELINE PAYLOAD INSPECTOR // STEP {STEPS[activeStep].id}</p>
                <h3 className="text-lg font-bold text-landing-primary">{STEPS[activeStep].title}</h3>
              </div>
            </div>

            {/* JetBrains Mono JSON Print */}
            <div className="p-6 bg-landing-bg border border-landing-divider/50 rounded-lg font-mono text-xs text-landing-secondary leading-relaxed overflow-x-auto">
              <pre className="text-landing-accentSoft">
                {JSON.stringify(STEPS[activeStep].json, null, 2)}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-landing-divider/20 flex-wrap gap-4 text-xs mt-6">
              <span className="text-landing-muted font-mono">System state: operational // validation criteria verified</span>
              <button className="btn-proper-secondary text-[11px] py-2">
                Inspect Raw Schema <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
