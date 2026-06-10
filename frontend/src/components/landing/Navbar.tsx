import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Link as RouterLink } from 'react-router-dom'
import { XtarzLogo } from '../ui/XtarzLogo'

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Results', href: '#results' },
  { label: 'Pricing', href: '#pricing' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const sections = NAV_LINKS.map((link) => link.href.substring(1))
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-4 px-4 pointer-events-none">
      <nav
        className={cn(
          'pointer-events-auto flex items-center justify-between px-6 transition-all duration-300 w-full max-w-7xl mx-auto rounded-xl',
          isScrolled
            ? 'h-16 bg-landing-surface/95 border border-landing-divider shadow-md'
            : 'h-16 bg-transparent border border-transparent'
        )}
      >
        <RouterLink to="/" className="group">
          <XtarzLogo />
        </RouterLink>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className={cn(
                'px-3.5 py-2 text-sm font-medium transition-colors duration-200 rounded-lg',
                activeSection === link.href.substring(1)
                  ? 'text-landing-accent'
                  : 'text-landing-secondary hover:text-landing-primary'
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <RouterLink
            to="/auth/login"
            className="text-landing-secondary hover:text-landing-primary text-sm font-medium px-3 transition-colors"
          >
            Sign in
          </RouterLink>
          <RouterLink to="/auth/signup" className="btn-proper-primary py-2 px-4 cursor-pointer">
            Start free
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </RouterLink>
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-landing-secondary hover:text-landing-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-landing-surface border border-landing-divider rounded-xl md:hidden overflow-hidden pointer-events-auto shadow-lg">
          <div className="flex flex-col p-4 gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-sm font-medium text-landing-secondary hover:text-landing-primary py-2.5 px-3 rounded-lg hover:bg-landing-elevated transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="h-px bg-landing-divider my-2" />
            <RouterLink
              to="/auth/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-landing-secondary hover:text-landing-primary py-2.5 px-3 rounded-lg text-center"
            >
              Sign in
            </RouterLink>
            <RouterLink
              to="/auth/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-proper-primary w-full py-3 cursor-pointer justify-center flex items-center gap-2 mt-1"
            >
              Start free <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </RouterLink>
          </div>
        </div>
      )}
    </div>
  )
}
