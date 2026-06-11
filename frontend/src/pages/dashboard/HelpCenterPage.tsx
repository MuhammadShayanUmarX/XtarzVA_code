import { Link } from 'react-router-dom'
import {
  HelpCircle, BookOpen, MessageSquare, Sparkles, Store, Eye,
  Megaphone, Package, Wand2, ChevronRight, Mail
} from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Product Discovery', desc: 'Find winning products', icon: Sparkles, path: '/dashboard/products' },
  { label: 'Competitor Intel', desc: 'Map market gaps', icon: Store, path: '/dashboard/insights' },
  { label: 'Ad Spying', desc: 'Track competitor ads', icon: Eye, path: '/dashboard/ad-spy' },
  { label: 'Ad Creative', desc: 'Generate copy & creatives', icon: Megaphone, path: '/dashboard/ads' },
  { label: 'Sourcing', desc: 'Find suppliers', icon: Package, path: '/dashboard/sourcing' },
  { label: 'Store Builder', desc: 'Shopify theme ZIP', icon: Wand2, path: '/dashboard/shopify' },
]

const FAQS = [
  {
    q: 'How do I start product research?',
    a: 'Go to Product Discovery, enter a niche or product idea, and run a scan. Results appear in Run History and can be imported into other agents.',
  },
  {
    q: 'What is the difference between Ad Spying and Ad Creative?',
    a: 'Ad Spying analyzes live competitor ads — hooks, spend estimates, and winning patterns. Ad Creative generates SEO copy, product descriptions, tags, hooks, and image creatives for your product.',
  },
  {
    q: 'Can I import a discovered product into other agents?',
    a: 'Yes. On Competitor Intel, Sourcing, and Ad Creative pages, use the "Import from Product Discovery" section to pull in a product you already researched.',
  },
  {
    q: 'Where do I download my Shopify theme?',
    a: 'After Store Builder completes, open the run from Run History or the workflow page and download the theme ZIP.',
  },
  {
    q: 'How do I report a bug or request a feature?',
    a: 'Use the Feedback page in the dashboard sidebar. Your message is saved and reviewed by the team.',
  },
]

export default function HelpCenterPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-12 pb-32">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-landing-accent/10 border border-landing-accent/20 flex items-center justify-center text-landing-accent">
            <HelpCircle size={24} />
          </div>
          <h1 className="text-4xl font-black text-landing-primary tracking-tight">Help Center</h1>
        </div>
        <p className="text-lg text-landing-secondary font-medium max-w-2xl">
          Guides, FAQs, and quick links to get the most out of XtarzVA.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="glass-panel p-8 rounded-[28px] border-landing-divider space-y-4">
          <div className="flex items-center gap-3 text-landing-accent">
            <BookOpen size={20} />
            <h2 className="text-lg font-black text-white">Getting started</h2>
          </div>
          <ol className="space-y-3 text-sm text-landing-secondary list-decimal list-inside">
            <li>Run <strong className="text-white">Product Discovery</strong> on your niche.</li>
            <li>Use <strong className="text-white">Competitor Intel</strong> and <strong className="text-white">Ad Spying</strong> to understand the market.</li>
            <li>Generate <strong className="text-white">Ad Creative</strong> and build your <strong className="text-white">Store</strong>.</li>
            <li>Track everything in <strong className="text-white">Run History</strong> and <strong className="text-white">Analytics</strong>.</li>
          </ol>
        </section>

        <section className="glass-panel p-8 rounded-[28px] border-landing-divider space-y-4">
          <div className="flex items-center gap-3 text-landing-accentSoft">
            <MessageSquare size={20} />
            <h2 className="text-lg font-black text-white">Need more help?</h2>
          </div>
          <p className="text-sm text-landing-secondary">
            Share feedback, report bugs, or request features directly from the dashboard.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard/feedback"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-landing-accent text-white text-sm font-black hover:bg-landing-accent/90 transition-all"
            >
              Send feedback
              <ChevronRight size={16} />
            </Link>
            <a
              href="mailto:support@xtarzva.com"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-landing-surface border border-landing-divider text-sm font-black text-landing-secondary hover:text-white transition-all"
            >
              <Mail size={16} />
              Email support
            </a>
          </div>
        </section>
      </div>

      <section className="space-y-6">
        <h2 className="text-xl font-black text-white">Quick links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="glass-panel p-5 rounded-2xl border-landing-divider hover:border-landing-accent/30 transition-all group flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-landing-elevated flex items-center justify-center text-landing-muted group-hover:text-landing-accent transition-colors shrink-0">
                <item.icon size={18} />
              </div>
              <div>
                <p className="text-sm font-black text-white">{item.label}</p>
                <p className="text-xs text-landing-muted mt-1">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-black text-white">Frequently asked questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="glass-panel rounded-2xl border-landing-divider group open:border-landing-accent/20"
            >
              <summary className="px-6 py-4 cursor-pointer text-sm font-black text-white list-none flex items-center justify-between">
                {faq.q}
                <ChevronRight size={16} className="text-landing-muted group-open:rotate-90 transition-transform" />
              </summary>
              <p className="px-6 pb-5 text-sm text-landing-secondary leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
