import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { XtarzLogo } from '../ui/XtarzLogo'

const NAV_LINKS = [
  { label: 'How it works', to: '/#how-it-works', sectionId: 'how-it-works' },
  { label: 'Features', to: '/#features', sectionId: 'features' },
  { label: 'About', to: '/#about', sectionId: 'about' },
  { label: 'Results', to: '/#results', sectionId: 'results' },
  { label: 'Pricing', to: '/#pricing', sectionId: 'pricing' },
]

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      if (!isHome) return

      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.sectionId)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(link.sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  useEffect(() => {
    if (!isHome || !location.hash) return
    const id = location.hash.replace('#', '')
    const timer = window.setTimeout(() => scrollToSection(id), 100)
    return () => window.clearTimeout(timer)
  }, [isHome, location.hash])

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false)
    if (isHome) {
      scrollToSection(sectionId)
    }
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
            <RouterLink
              key={link.label}
              to={link.to}
              onClick={() => handleNavClick(link.sectionId)}
              className={cn(
                'px-3.5 py-2 text-sm font-medium transition-colors duration-200 rounded-lg',
                isHome && activeSection === link.sectionId
                  ? 'text-landing-accent'
                  : 'text-landing-secondary hover:text-landing-primary'
              )}
            >
              {link.label}
            </RouterLink>
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
              <RouterLink
                key={link.label}
                to={link.to}
                onClick={() => handleNavClick(link.sectionId)}
                className="text-sm font-medium text-landing-secondary hover:text-landing-primary py-2.5 px-3 rounded-lg hover:bg-landing-elevated transition-colors"
              >
                {link.label}
              </RouterLink>
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
