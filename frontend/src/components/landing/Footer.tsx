import { Link } from 'react-router-dom'
import { Twitter, Linkedin, Youtube, MessageSquare, Send } from 'lucide-react'
import { Logo3DSmall } from '../ui/Logo3D'

const LINKS = [
  {
    title: 'Product',
    items: [
      { label: 'Features',          to: '/#features' },
      { label: 'Pricing',           to: '/#pricing' },
      { label: 'How It Works',      to: '/#how-it-works' },
    ]
  },
  {
    title: 'Resources',
    items: [
      { label: 'Blog',              to: '/blog' },
      { label: 'Success Stories',   to: '/blog' },
      { label: 'Tutorials',         to: '/blog' },
    ]
  },
  {
    title: 'Company',
    items: [
      { label: 'About',             to: '/about' },
      { label: 'Careers',           to: '/careers', badge: '2' },
      { label: 'Contact Us',        to: '/contact' },
    ]
  },
  {
    title: 'Legal',
    items: [
      { label: 'Privacy Policy',    to: '/privacy' },
      { label: 'Terms of Service',  to: '/terms' },
      { label: 'Cookie Policy',     to: '/cookies' },
    ]
  }
]

const SOCIALS = [Twitter, Linkedin, Youtube, MessageSquare]

export default function Footer() {
  return (
    <footer className="bg-landing-surface border-t border-landing-divider/30 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top Row */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-20 pb-12 border-b border-landing-divider/20">
          <div className="max-w-sm space-y-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-landing-elevated flex items-center justify-center border border-landing-divider/30">
                <Logo3DSmall className="w-6 h-6" />
              </div>
              <span className="text-landing-primary font-bold text-base tracking-tight">Xtarz</span>
            </Link>
            <p className="text-landing-secondary text-xs leading-relaxed">
              The all-in-one platform for Shopify sellers who want to find winning products, beat competitors, and launch stores faster.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#96bf48]/10 border border-[#96bf48]/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#96bf48]" />
              <span className="text-[10px] font-bold text-[#96bf48] uppercase tracking-wider">Shopify Partner</span>
            </div>
          </div>

          {/* Newsletter */}
          <div className="max-w-md w-full space-y-4">
            <div>
              <p className="text-xs font-bold text-landing-primary uppercase tracking-wider">Get Weekly Winning Product Ideas</p>
              <p className="text-[11px] text-landing-secondary mt-1">Every Sunday — trending products, margin insights, and seller tips.</p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-landing-bg border border-landing-divider/40 rounded px-4 py-2.5 text-xs text-landing-primary placeholder-landing-muted focus:outline-none focus:border-landing-accent/50 transition-all"
              />
              <button className="btn-proper-primary text-[10px] py-2.5 px-4">
                Subscribe <Send className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[9px] text-landing-muted">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {LINKS.map(col => (
            <div key={col.title} className="space-y-4">
              <h4 className="text-[10px] font-bold text-landing-primary uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2">
                {col.items.map(item => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-xs text-landing-secondary hover:text-landing-primary transition-colors flex items-center gap-2"
                    >
                      {item.label}
                      {'badge' in item && item.badge && (
                        <span className="px-1.5 py-0.5 rounded bg-landing-accent/15 text-landing-accent text-[9px] font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px bg-landing-divider/20 w-full mb-8" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-landing-secondary">
          <p className="text-left">
            © 2025 Xtarz. A product of{' '}
            <a 
              href="https://xtarzlab.site" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-landing-primary hover:text-landing-accent transition-colors font-semibold underline underline-offset-2"
            >
              XtarzLab
            </a>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {SOCIALS.map((Icon, i) => (
              <Link key={i} to="#" className="text-landing-secondary hover:text-landing-primary transition-all">
                <Icon className="w-4 h-4" />
              </Link>
            ))}
          </div>

          <div className="italic flex items-center gap-1.5 text-landing-muted">
            <span>Developed by <span className="text-landing-primary font-medium not-italic">Muhammad Shayan Umar</span></span>
            <a 
              href="https://www.linkedin.com/in/muhammad-shayan-umar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-landing-accent hover:text-landing-primary transition-colors flex items-center"
              title="Muhammad Shayan Umar on LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
