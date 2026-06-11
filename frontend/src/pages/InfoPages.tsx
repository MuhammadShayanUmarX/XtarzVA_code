import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Zap, TrendingUp, CheckCircle2 } from 'lucide-react'
import { XtarzLogo } from '../components/ui/XtarzLogo'
import Navbar from '../components/landing/Navbar'
import AboutSection from '../components/landing/AboutSection'
import Footer from '../components/landing/Footer'

// Shared page shell for simple info pages
export function PageShell({ children, label, title, subtitle }: {
  children: React.ReactNode, label: string, title: React.ReactNode, subtitle: string
}) {
  return (
    <div className="min-h-screen bg-brand-950 text-brand-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[700px] h-[400px] bg-accent-primary/[0.05] blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-accent-violet/[0.04] blur-[120px] rounded-full" />
      </div>
      <div className="absolute inset-0 opacity-[0.018] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />

      <header className="fixed top-0 left-0 right-0 z-[100] h-16 flex items-center px-6 border-b border-white/[0.05] bg-brand-950/80 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2 text-brand-400 hover:text-brand-50 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to XtarzVA
        </Link>
        <Link to="/" className="ml-6">
          <XtarzLogo markClassName="w-6 h-6" textClassName="text-sm font-bold text-brand-50" />
        </Link>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14 text-center">
          <span className="section-label block mb-4">{label}</span>
          <h1 className="text-4xl md:text-5xl font-black text-brand-50 tracking-tighter leading-tight mb-4">{title}</h1>
          <p className="text-lg text-brand-400 max-w-xl mx-auto">{subtitle}</p>
        </motion.div>
        {children}
      </div>
    </div>
  )
}

// ── Features ──────────────────────────────────────────────────────────────────
export function FeaturesPage() {
  const navigate = useNavigate()
  const features = [
    { icon: '🔍', title: 'Multi-Signal Product Discovery', desc: 'Agents scan TikTok, Reddit, AliExpress and Google Shopping simultaneously — not sequentially — to find trending products before they peak.', badge: 'Core' },
    { icon: '⚔️', title: 'Competitor Intelligence Engine', desc: 'Map rival pricing, mine negative reviews for gaps, and score your competitive position for every product before you spend a dollar.', badge: 'Core' },
    { icon: '📈', title: 'Profit Architect & Kill Criteria', desc: 'Model exact COGS from AliExpress suppliers, shipping costs, Shopify fees and ad spend. Set your margin floor and the system kills losers automatically.', badge: 'Core' },
    { icon: '✍️', title: 'AI SEO Copywriter', desc: 'Generate keyword-optimized product titles, descriptions, and bullet points aligned with Shopify SEO best practices. Average SEO score: 94/100.', badge: 'Core' },
    { icon: '🎨', title: 'Creative Director — AI Imagery', desc: 'Generate studio-quality product photos, lifestyle shots, and ad-ready creatives for every approved product. No photographers, no freelancers.', badge: 'Core' },
    { icon: '⚡', title: 'Shopify Listing Automator', desc: 'Push every approved product — title, description, images, price, tags — directly to your Shopify Admin API in one click. Zero copy-pasting.', badge: 'Core' },
    { icon: '📊', title: 'Real-Time Agent Console', desc: 'Watch all six agents work in parallel through a live terminal-style console. Full audit trail, timestamps, and reasoning per agent.', badge: 'Dashboard' },
    { icon: '🔔', title: 'Kill Criteria Alerts', desc: 'Get instant alerts when a product breaches your margin threshold mid-analysis, before any budget is committed.', badge: 'Dashboard' },
  ]

  return (
    <PageShell label="Platform Features" title={<>Everything you need to<br /><span className="gradient-text">dominate Shopify.</span></>} subtitle="XtarzVA is purpose-built for Shopify dropshippers. Every feature is designed to reduce research time, eliminate guesswork, and maximize margin.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="p-6 rounded-2xl border border-white/[0.07] bg-brand-800/30 hover:bg-brand-800/50 transition-all">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{f.icon}</span>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20 uppercase tracking-wider">{f.badge}</span>
            </div>
            <h3 className="text-base font-black text-brand-50 mb-2">{f.title}</h3>
            <p className="text-sm text-brand-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-black text-brand-50 transition-all hover:brightness-110" style={{ background: 'linear-gradient(135deg, #4f6ef7, #a78bfa)', boxShadow: '0 0 24px rgba(79,110,247,0.3)' }}>
          <Zap className="w-4 h-4 fill-current" /> Go to Dashboard
        </button>
      </div>
    </PageShell>
  )
}

// ── Pricing ──────────────────────────────────────────────────────────────────
export function PricingPage() {
  const navigate = useNavigate()
  const plans = [
    {
      name: 'Starter', price: '$49', period: '/month', desc: 'Perfect for solo dropshippers getting started.',
      color: '#22d3ee',
      features: ['5 runs per month', 'Up to 50 products/run', 'All 6 AI agents', 'Shopify auto-publish', 'Email support'],
    },
    {
      name: 'Growth', price: '$99', period: '/month', desc: 'For serious sellers scaling to 6 figures.', popular: true,
      color: '#4f6ef7',
      features: ['Unlimited runs', 'Up to 200 products/run', 'Priority agent queue', 'Advanced kill criteria', 'AI image generation', 'Slack support'],
    },
    {
      name: 'Agency', price: '$299', period: '/month', desc: 'Manage multiple Shopify stores at scale.',
      color: '#a78bfa',
      features: ['Unlimited runs', 'Up to 10 Shopify stores', 'White-label exports', 'Team seats (5 users)', 'Dedicated onboarding', 'SLA guarantee'],
    },
  ]
  return (
    <PageShell label="Pricing" title={<>Simple pricing. <span className="gradient-text">Zero surprises.</span></>} subtitle="All plans include every AI agent, Shopify auto-publish, and a 14-day free trial. No credit card required to start.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan, i) => (
          <motion.div key={plan.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`relative p-6 rounded-2xl border ${plan.popular ? 'border-accent-primary/40' : 'border-white/[0.07]'} bg-brand-800/30`}>
            {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent-primary text-brand-50 text-[10px] font-black uppercase tracking-widest">Most Popular</div>}
            <p className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: plan.color }}>{plan.name}</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-black text-brand-50">{plan.price}</span>
              <span className="text-brand-500 text-sm">{plan.period}</span>
            </div>
            <p className="text-sm text-brand-400 mb-6">{plan.desc}</p>
            <ul className="space-y-2.5 mb-8">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-brand-300">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: plan.color }} /> {f}
                </li>
              ))}
            </ul>
            <button onClick={() => navigate('/dashboard')} className="w-full h-11 rounded-xl font-black text-sm flex items-center justify-center transition-all hover:brightness-110" style={plan.popular ? { background: 'linear-gradient(135deg,#4f6ef7,#a78bfa)', color: '#fff', boxShadow: '0 0 20px rgba(79,110,247,0.3)' } : { background: `${plan.color}12`, color: plan.color, border: `1px solid ${plan.color}25` }}>
              Go to Dashboard
            </button>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-sm text-brand-600 mt-8">All prices in USD. Annual plans save 30%. <Link to="/contact" className="text-accent-primary hover:underline">Contact us</Link> for enterprise pricing.</p>
    </PageShell>
  )
}

// ── About ────────────────────────────────────────────────────────────────────
export function AboutPage() {
  return (
    <div className="bg-landing-bg min-h-screen text-landing-primary selection:bg-landing-accent/25 font-sans">
      <Navbar />
      <main className="pt-16">
        <AboutSection />
      </main>
      <Footer />
    </div>
  )
}

// ── Blog (placeholder) ───────────────────────────────────────────────────────
export function BlogPage() {
  const posts = [
    { title: 'How to find $10K/month products on TikTok before they peak', date: 'Apr 22, 2025', tag: 'Strategy', readTime: '6 min' },
    { title: 'The 35% margin rule: why most dropshippers quit before they win', date: 'Apr 18, 2025', tag: 'Profit', readTime: '5 min' },
    { title: "AI vs manual research: we ran both for 30 days and here's the data", date: 'Apr 14, 2025', tag: 'Research', readTime: '8 min' },
    { title: 'Shopify SEO in 2025: what the algorithm rewards and what it penalizes', date: 'Apr 10, 2025', tag: 'SEO', readTime: '7 min' },
    { title: 'Why AliExpress order velocity is the most underrated trend signal', date: 'Apr 5, 2025', tag: 'Research', readTime: '4 min' },
    { title: 'Case study: How a solo seller scaled to $44K/mo using XtarzVA in 60 days', date: 'Apr 1, 2025', tag: 'Case Study', readTime: '10 min' },
  ]
  return (
    <PageShell label="Blog" title={<>Insights for <span className="gradient-text">Shopify sellers.</span></>} subtitle="Strategy, research, and data-driven insights to help you build a winning product catalog.">
      <div className="space-y-4">
        {posts.map((post, i) => (
          <motion.div key={post.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.07] bg-brand-800/30 hover:bg-brand-800/50 transition-all group cursor-pointer">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20 uppercase tracking-wider">{post.tag}</span>
                <span className="text-[11px] text-brand-600">{post.readTime} read</span>
              </div>
              <h3 className="text-sm font-black text-brand-50 group-hover:text-accent-primary transition-colors leading-snug">{post.title}</h3>
              <p className="text-xs text-brand-600 mt-1">{post.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </PageShell>
  )
}

// ── Careers ──────────────────────────────────────────────────────────────────
export function CareersPage() {
  const jobs = [
    { 
      title: 'Backend Python Intern (Agentic Systems & LLMs)', 
      team: 'AI Engineering', 
      type: 'Remote / Islamabad Hybrid', 
      loc: 'Worldwide',
      desc: 'Work directly with our lead architect to build, optimize, and test concurrent agentic workflows using FastAPI, Groq, Tavily, and advanced NLP swarms. Solid Python skills and familiarity with LangChain, crewAI, or custom LLM function-calling are highly valued.'
    },
    { 
      title: 'Frontend Developer & UI Designer', 
      team: 'Product Design & Engineering', 
      type: 'Remote', 
      loc: 'Worldwide',
      desc: 'Craft beautiful, high-performance web applications using React, TailwindCSS, Vite, and Framer Motion. We are looking for an engineer with a strong eye for micro-animations, rich glassmorphism aesthetics, and clean responsive layouts.'
    },
    { 
      title: 'Business Development & Growth Associate', 
      team: 'Growth & Operations', 
      type: 'Remote', 
      loc: 'Worldwide',
      desc: 'Drive strategic partnerships, merchant acquisition, and organic community growth for Xtarz Commerce OS. Help solo dropshippers and e-commerce brands discover and integrate cognitive agent automation.'
    },
  ]
  return (
    <PageShell label="Careers" title={<>Build AI that <span className="gradient-text">powers real stores.</span></>} subtitle="We're a small, ambitious team building the future of Shopify automation. Remote-first, mission-driven, equity included.">
      <div className="space-y-4">
        {jobs.map((job, i) => (
          <motion.div key={job.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-white/[0.07] bg-brand-800/30 hover:bg-brand-800/50 transition-all">
            <div className="flex-1">
              <h3 className="text-sm font-black text-brand-50 mb-1">{job.title}</h3>
              <p className="text-xs text-brand-500 mb-2">{job.team} · {job.type} · {job.loc}</p>
              <p className="text-xs text-brand-400 max-w-2xl leading-relaxed">{job.desc}</p>
            </div>
            <Link to="/contact" className="text-xs font-bold text-accent-primary hover:underline flex items-center gap-1 self-start sm:self-center flex-shrink-0">Apply →</Link>
          </motion.div>
        ))}
        <div className="p-6 rounded-2xl border border-accent-violet/20 bg-accent-violet/[0.04] text-center mt-8">
          <p className="text-sm text-brand-400 mb-4">Don't see your role? We hire for passion, not just job titles.</p>
          <Link to="/contact" className="text-sm font-bold text-accent-violet hover:underline">Send us your CV anyway →</Link>
        </div>
      </div>
    </PageShell>
  )
}

// ── Changelog ────────────────────────────────────────────────────────────────
export function ChangelogPage() {
  const updates = [
    { version: 'v2.4.0', date: 'May 1, 2025', title: 'Multimodal Agent Reasoning', desc: 'Agents can now analyze product videos and lifestyle shots to score visual quality automatically.', icon: Zap },
    { version: 'v2.3.8', date: 'Apr 12, 2025', title: 'Shopify Admin API v2 Integration', desc: 'Reduced publishing latency by 40% and added support for multi-location inventory syncing.', icon: CheckCircle2 },
    { version: 'v2.3.0', date: 'Mar 28, 2025', title: 'Reddit Signal Mining', desc: 'New agent specialized in identifying "problem/solution" threads on niche subreddits for product validation.', icon: TrendingUp },
  ]
  return (
    <PageShell label="Changelog" title={<>What's new in <span className="gradient-text">XtarzVA.</span></>} subtitle="Tracking the evolution of our AI agent swarm. Constant updates, zero downtime.">
      <div className="space-y-12">
        {updates.map((update, i) => (
          <motion.div key={update.version} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative pl-8 border-l border-brand-700">
            <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-accent-primary shadow-[0_0_10px_rgba(79,110,247,0.5)]" />
            <div className="mb-2">
              <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{update.date}</span>
              <h3 className="text-xl font-black text-brand-50 mt-1">{update.title} <span className="text-accent-primary text-xs ml-2">{update.version}</span></h3>
            </div>
            <p className="text-brand-400 text-sm leading-relaxed max-w-2xl">{update.desc}</p>
          </motion.div>
        ))}
      </div>
    </PageShell>
  )
}

// ── Roadmap ──────────────────────────────────────────────────────────────────
export function RoadmapPage() {
  const stages = [
    { status: 'In Progress', title: 'AI Ad Architect', desc: 'Auto-generation of Facebook and TikTok ad scripts based on winning product features.' },
    { status: 'Planned', title: 'Voice Ops', desc: 'Command your agent swarm via voice notes for true hands-free product research.' },
    { status: 'Backlog', title: 'Supplier Negotation Agent', desc: 'Direct WhatsApp integration with AliExpress suppliers to auto-negotiate better margins.' },
  ]
  return (
    <PageShell label="Product Roadmap" title={<>The future of <span className="gradient-text">Shopify automation.</span></>} subtitle="Our mission is to eliminate every manual task in dropshipping. Here's what's coming next.">
      <div className="grid grid-cols-1 gap-6">
        {stages.map((stage, i) => (
          <motion.div key={stage.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl border border-white/[0.07] bg-brand-800/30">
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider mb-3 inline-block ${stage.status === 'In Progress' ? 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20' : 'bg-brand-600/10 text-brand-500 border border-brand-600/20'}`}>
              {stage.status}
            </span>
            <h3 className="text-lg font-black text-brand-50 mb-2">{stage.title}</h3>
            <p className="text-sm text-brand-400 leading-relaxed">{stage.desc}</p>
          </motion.div>
        ))}
      </div>
    </PageShell>
  )
}
