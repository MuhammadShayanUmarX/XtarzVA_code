import { Link } from 'react-router-dom'
import { Twitter, Linkedin, Youtube, MessageSquare, Send } from 'lucide-react'
import { XtarzLogo } from '../ui/XtarzLogo'

const LINKS = [
  {
    title: 'Product',
    items: [
      { label: 'Features', to: '/#features' },
      { label: 'Pricing', to: '/#pricing' },
      { label: 'How it works', to: '/#how-it-works' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { label: 'Blog', to: '/blog' },
      { label: 'Success stories', to: '/blog' },
      { label: 'Tutorials', to: '/blog' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About', to: '/#about' },
      { label: 'Careers', to: '/careers', badge: '2' },
      { label: 'Contact us', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { label: 'Privacy policy', to: '/privacy' },
      { label: 'Terms of service', to: '/terms' },
      { label: 'Cookie policy', to: '/cookies' },
    ],
  },
]

const SOCIALS = [Twitter, Linkedin, Youtube, MessageSquare]

export default function Footer() {
  return (
    <footer className="bg-landing-surface border-t border-landing-divider pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16 pb-12 border-b border-landing-divider">
          <div className="max-w-sm space-y-4">
            <Link to="/">
              <XtarzLogo />
            </Link>
            <p className="text-landing-secondary text-sm leading-relaxed">
              The workflow platform for Shopify sellers who want to find winning products, beat competitors, and launch faster.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#96bf48]/10 border border-[#96bf48]/20">
              <span className="text-xs font-medium text-[#96bf48]">Shopify Partner</span>
            </div>
          </div>

          <div className="max-w-md w-full space-y-4">
            <div>
              <p className="text-sm font-medium text-landing-primary">Weekly product ideas</p>
              <p className="text-sm text-landing-secondary mt-1">Trending products, margin insights, and seller tips.</p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-landing-bg border border-landing-divider rounded-lg px-4 py-2.5 text-sm text-landing-primary placeholder-landing-muted focus:outline-none focus:border-landing-accent/50 transition-colors"
              />
              <button type="button" className="btn-proper-primary py-2.5 px-4 shrink-0">
                Subscribe <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>
            <p className="text-xs text-landing-muted">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {LINKS.map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="text-xs font-medium text-landing-primary">{col.title}</h4>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-landing-secondary hover:text-landing-primary transition-colors flex items-center gap-2"
                    >
                      {item.label}
                      {'badge' in item && item.badge && (
                        <span className="px-1.5 py-0.5 rounded bg-landing-accent/15 text-landing-accent text-xs font-medium">
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

        <div className="h-px bg-landing-divider w-full mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-landing-secondary">
          <p>
            © 2025 XtarzVA. A product of{' '}
            <a
              href="https://xtarzlab.site"
              target="_blank"
              rel="noopener noreferrer"
              className="text-landing-primary hover:text-landing-accent transition-colors font-medium underline underline-offset-2"
            >
              XtarzLab
            </a>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {SOCIALS.map((Icon, i) => (
              <Link key={i} to="#" className="text-landing-muted hover:text-landing-primary transition-colors" aria-label="Social link">
                <Icon className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-landing-muted">
            <span>
              Developed by{' '}
              <span className="text-landing-primary font-medium">Muhammad Shayan Umar</span>
            </span>
            <a
              href="https://www.linkedin.com/in/muhammad-shayan-umar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-landing-accent hover:text-landing-accentSoft transition-colors"
              title="Muhammad Shayan Umar on LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
