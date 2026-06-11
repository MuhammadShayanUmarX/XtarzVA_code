import {
  Target,
  Compass,
  Route,
  Sparkles,
  Award,
  Linkedin,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const ICON = { strokeWidth: 1.5 as const }

const JOURNEY = [
  {
    year: '2022',
    title: 'XtarzLab begins',
    description: 'Started building commerce tools and custom research workflows for sellers who were drowning in spreadsheets.',
  },
  {
    year: '2024',
    title: 'Agent workflow takes shape',
    description: 'Product research, competitor intel, sourcing, and store assets merged into one structured pipeline.',
  },
  {
    year: '2025',
    title: 'XtarzVA launches',
    description: 'A focused platform for Shopify sellers — from product signal to uploadable theme, in one run.',
  },
]

const VALUES = [
  {
    icon: Target,
    title: 'Margin before marketing',
    description: 'We surface supplier cost, fees, and realistic retail price before you spend on ads or inventory.',
  },
  {
    icon: Compass,
    title: 'Research you can act on',
    description: 'Clear reports — demand scores, competitor gaps, and positioning — not raw data dumps.',
  },
  {
    icon: Sparkles,
    title: 'Launch-ready outputs',
    description: 'SEO copy, ad hooks, creatives, and an uploadable Shopify OS 2.0 theme ZIP in one workflow.',
  },
  {
    icon: Route,
    title: 'Built for operators',
    description: 'Designed for sellers who run stores, not researchers who only browse trends.',
  },
]

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-landing-surface border-t border-landing-divider">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="section-eyebrow">About XtarzVA</span>
          <h2 className="text-3xl md:text-4xl font-semibold text-landing-primary tracking-tight leading-tight">
            Commerce intelligence built for{' '}
            <span className="text-landing-accent">serious Shopify sellers.</span>
          </h2>
          <p className="text-lg text-landing-secondary leading-relaxed">
            XtarzVA helps you find winning products, validate margins, and ship a premium storefront — without juggling five different tools.
          </p>
        </div>

        {/* Story */}
        <div className="landing-card p-8 md:p-10 mb-10">
          <h3 className="text-xl font-semibold text-landing-primary mb-4">Our story</h3>
          <div className="space-y-4 text-landing-secondary text-sm md:text-base leading-relaxed max-w-4xl">
            <p>
              Most sellers lose weeks jumping between trend tools, supplier sites, competitor tabs, and Canva — then still launch with unclear margins. XtarzVA was built to close that gap.
            </p>
            <p>
              Born from years of work at XtarzLab, the platform turns fragmented research into a single workflow: discover, compare, source, create, and build. You get evidence-backed decisions and launch assets, not another generic dashboard.
            </p>
          </div>
        </div>

        {/* Founder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="landing-card p-8 flex flex-col items-center text-center lg:col-span-1">
            <div className="w-40 h-40 rounded-full overflow-hidden mb-5 border-2 border-landing-accent/40 ring-4 ring-landing-accent/10">
              <img
                src="/founder_image.png"
                alt="Muhammad Shayan Umar — Founder of XtarzVA"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <h3 className="text-lg font-semibold text-landing-primary">Muhammad Shayan Umar</h3>
            <p className="text-sm text-landing-accent mt-1">Founder & Lead Architect</p>
            <p className="text-xs text-landing-muted mt-1">Islamabad, Pakistan · XtarzLab</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="text-xs px-2.5 py-1 rounded-md bg-landing-elevated border border-landing-divider text-landing-secondary">
                AI/ML Engineer
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-landing-elevated border border-landing-divider text-landing-secondary">
                Commerce systems
              </span>
            </div>
            <a
              href="https://www.linkedin.com/in/muhammad-shayan-umar"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-landing-accent hover:text-landing-accentSoft transition-colors"
            >
              <Linkedin className="w-4 h-4" {...ICON} />
              Connect on LinkedIn
            </a>
          </div>

          <div className="landing-card p-8 lg:col-span-2 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-landing-primary">About the founder</h3>
              <p className="text-sm text-landing-secondary leading-relaxed">
                Shayan builds products where technical depth meets merchant outcomes. His focus is practical systems — research pipelines, structured outputs, and workflows that save sellers real hours.
              </p>
              <p className="text-sm text-landing-secondary leading-relaxed">
                Through XtarzLab he has shipped agentic commerce tooling, LLM-powered research flows, and automation for brands that need speed without sacrificing decision quality.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-landing-divider">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-landing-accent/10 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-landing-accent" {...ICON} />
                </div>
                <div>
                  <p className="text-sm font-medium text-landing-primary">AISKILLBRIDGE</p>
                  <p className="text-xs text-landing-muted">Top 1% — Agentic AI program</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-landing-accent/10 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-landing-accent" {...ICON} />
                </div>
                <div>
                  <p className="text-sm font-medium text-landing-primary">NACTA Hackathon</p>
                  <p className="text-xs text-landing-muted">National winner — intelligence systems</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="landing-card p-8 border-landing-accent/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-landing-accent" />
              <h3 className="text-lg font-semibold text-landing-primary">Vision</h3>
            </div>
            <p className="text-sm text-landing-secondary leading-relaxed">
              A world where every Shopify seller — solo or agency — launches with the same research rigor as a seven-figure brand, without hiring a full ops team.
            </p>
          </div>
          <div className="landing-card p-8 border-landing-accent/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-landing-accentSoft" />
              <h3 className="text-lg font-semibold text-landing-primary">Mission</h3>
            </div>
            <p className="text-sm text-landing-secondary leading-relaxed">
              Replace guesswork with a repeatable launch workflow: prove demand, prove margin, ship creative, and deliver an uploadable store — in one platform.
            </p>
          </div>
        </div>

        {/* Journey */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-landing-primary mb-6 text-center">Our journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {JOURNEY.map((step) => (
              <div key={step.year} className="landing-card p-6">
                <span className="text-sm font-semibold text-landing-accent">{step.year}</span>
                <h4 className="text-base font-semibold text-landing-primary mt-2 mb-2">{step.title}</h4>
                <p className="text-sm text-landing-secondary leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Value */}
        <div>
          <h3 className="text-xl font-semibold text-landing-primary mb-6 text-center">What we add for merchants</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((item) => (
              <div key={item.title} className="landing-card p-6">
                <div className="w-10 h-10 rounded-lg bg-landing-accent/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-landing-accent" {...ICON} />
                </div>
                <h4 className="text-sm font-semibold text-landing-primary mb-2">{item.title}</h4>
                <p className="text-sm text-landing-secondary leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/auth/signup" className="btn-proper-primary inline-flex">
            Start your first run
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  )
}
