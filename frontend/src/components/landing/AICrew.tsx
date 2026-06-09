import { Search, Swords, TrendingUp, Calculator, Palette, Send, ArrowRight, Activity } from 'lucide-react'

const AGENTS = [
  {
    name: 'Research Specialist',
    role: 'Signal Intelligence',
    accent: '#3E63DD',
    icon: Search,
    status: 'TikTok Trend Index',
    confidence: '98.4%',
    cpu: '12%',
    latency: '12ms',
    impact: 'Identifies viral momentum prior to saturation.',
    description: 'Monitors TikTok velocity index, Reddit sentiment scores, and global Google search volumes to isolate raw product opportunities.',
    tasks: ['TikTok Signal Auditing', 'Social Sentiment Mining', 'Velocity Index Scoring'],
  },
  {
    name: 'Market Strategist',
    role: 'Competitive Analysis',
    accent: '#8DA4EF',
    icon: Swords,
    status: 'Competitor Sourcing',
    confidence: '97.2%',
    cpu: '18%',
    latency: '24ms',
    impact: 'Locates pricing and supplier gaps rivals miss.',
    description: 'Maps competitor listings, audits pricing indexes, and identifies underserved niches with positive margin gaps.',
    tasks: ['Rival Pricing Mapping', 'Supplier Gap Diagnostics', 'Competitor Listing Audits'],
  },
  {
    name: 'Profit Architect',
    role: 'Financial Auditing',
    accent: '#D2F13C',
    icon: Calculator,
    status: 'COGS Verification',
    confidence: '99.1%',
    cpu: '8%',
    latency: '8ms',
    impact: 'Auto-audits product margins prior to ad tests.',
    description: 'Models full landed costs including COGS, cargo air freight, and checkout processing fees. Automatically kills low-margin listings.',
    tasks: ['Landed Cost Modeling', 'Cargo Freight Estimates', 'Kill Criteria Auditing'],
  },
  {
    name: 'Creative Director',
    role: 'Visual Synthesis',
    accent: '#3E63DD',
    icon: Palette,
    status: 'Rendering Renders',
    confidence: '96.8%',
    cpu: '45%',
    latency: '280ms',
    impact: 'Synthesizes high-fidelity studio assets.',
    description: 'Generates studio-quality product photos, lifestyle images, and multiple advertising copy variations instantly.',
    tasks: ['AI Image Synthesis', 'Lifestyle Visual Rendering', 'Brand Alignment Checks'],
  },
  {
    name: 'SEO Copywriter',
    role: 'Organic Growth',
    accent: '#8DA4EF',
    icon: TrendingUp,
    status: 'Optimizing Description',
    confidence: '94.5%',
    cpu: '14%',
    latency: '15ms',
    impact: 'Optimizes listings for high-converting keywords.',
    description: 'Generates SEO titles, bulleted descriptions, meta keywords, and structural tags based on customer search queries.',
    tasks: ['SEO Description Injection', 'Bulleted Copywriting', 'Meta Tag Compiling'],
  },
  {
    name: 'Sync Coordinator',
    role: 'API Automation',
    accent: '#D2F13C',
    icon: Send,
    status: 'Sync Channel Active',
    confidence: '100%',
    cpu: '9%',
    latency: '14ms',
    impact: 'Deploys listings directly to Shopify admin.',
    description: 'Packages and pushes title, copywriting, images, variants, and pricing directly to your Shopify catalog via secure API sync.',
    tasks: ['API Payload Packaging', 'Shopify Catalog Deployment', 'Synchronization Audits'],
  },
]

export default function AICrew() {
  return (
    <section id="features" className="py-32 bg-landing-bg relative overflow-hidden border-t border-landing-divider/10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-24">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-landing-accent">OPERATIONAL CREW</span>
          <h2 className="text-4xl md:text-5xl font-black text-landing-primary tracking-tightest mt-4">
            Autonomous Crew System. <br />
            <span className="text-landing-accent">Specialized Commerce Nodes.</span>
          </h2>
          <p className="text-base text-landing-secondary max-w-2xl mx-auto mt-4">
            Six specialized operational units working in parallel to eliminate traditional operational bottlenecks.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AGENTS.map((agent) => (
            <div
              key={agent.name}
              className="p-8 landing-panel border border-landing-divider/25 hover:border-landing-accent/30 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              {/* Top Row: Icon & Status */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded bg-landing-surface border border-landing-divider/30 flex items-center justify-center">
                    <agent.icon className="w-6 h-6 text-landing-accent" />
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-landing-muted">{agent.role}</p>
                    <div className="flex items-center gap-1.5 justify-end mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-landing-accentLime" />
                      <span className="text-[10px] font-mono text-landing-secondary uppercase tracking-wider font-bold">ONLINE</span>
                    </div>
                  </div>
                </div>

                {/* Identity */}
                <h3 className="text-xl font-bold text-landing-primary mt-4">{agent.name}</h3>
                <p className="text-xs font-bold text-landing-accentSoft mt-1.5">{agent.impact}</p>
                
                <p className="text-xs text-landing-secondary leading-relaxed mt-4 mb-6">{agent.description}</p>

                {/* Custom Node Telemetry Block */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-landing-surface border border-landing-divider/20 rounded mb-6 font-mono text-[10px]">
                  <div>
                    <span className="text-landing-muted block text-[8px] font-bold">NODE_CPU</span>
                    <span className="text-landing-primary font-bold">{agent.cpu}</span>
                  </div>
                  <div>
                    <span className="text-landing-muted block text-[8px] font-bold">LATENCY</span>
                    <span className="text-landing-primary font-bold">{agent.latency}</span>
                  </div>
                  <div>
                    <span className="text-landing-muted block text-[8px] font-bold">ACCURACY</span>
                    <span className="text-landing-accentLime font-bold">{agent.confidence}</span>
                  </div>
                </div>

                {/* Monospace Capabilities Output */}
                <div className="space-y-1.5">
                  <p className="text-[9px] font-mono font-bold text-landing-muted uppercase tracking-widest">CAPABILITY_OUTPUT_INDEX</p>
                  {agent.tasks.map((task, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-landing-divider rounded-sm" />
                      <span className="text-xs font-mono text-landing-secondary">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integrity Indicator */}
              <div className="pt-6 border-t border-landing-divider/25 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[9px] font-bold text-landing-muted uppercase tracking-wider">Gate Thread</p>
                  <p className="text-landing-primary font-bold font-mono mt-0.5">THREAD_0{AGENTS.indexOf(agent)+1}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-landing-muted uppercase tracking-wider">Gateway State</p>
                  <p className="text-xs font-mono text-landing-accentLime font-bold mt-0.5">VERIFIED</p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Coordination Footer */}
        <div className="mt-16 p-6 landing-panel border border-landing-divider/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-landing-accent/10 border border-landing-accent/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-landing-accent" />
            </div>
            <div>
              <p className="text-sm font-bold text-landing-primary">Sub-second Orchestration Parallelization</p>
              <p className="text-xs text-landing-secondary">All agent nodes communicate synchronously over secure local memory buffers.</p>
            </div>
          </div>
          <button className="btn-proper-secondary text-[11px] py-2">
            Inspect Swarm Architecture <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  )
}
