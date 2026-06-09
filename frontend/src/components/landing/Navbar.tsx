import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Link as RouterLink } from 'react-router-dom'
import { Logo3DSmall } from '../ui/Logo3D'

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
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

      const sections = NAV_LINKS.map(link => link.href.substring(1))
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
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-4 px-4 pointer-events-none">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'pointer-events-auto flex items-center justify-between px-6 transition-all duration-300 backdrop-blur-md w-full max-w-7xl mx-auto rounded-b-xl',
          isScrolled
            ? 'h-16 bg-landing-surface/90 border border-t-0 border-landing-divider/40 shadow-lg'
            : 'h-16 bg-transparent border border-transparent'
        )}
      >
        {/* Left: Logo */}
        <RouterLink to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-landing-elevated flex items-center justify-center border border-landing-divider/30">
            <Logo3DSmall className="w-6 h-6" />
          </div>
          <span className="text-landing-primary font-bold text-base tracking-tight">XtarzVA</span>
        </RouterLink>

        {/* Center: Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 bg-landing-surface/50 border border-landing-divider/30 rounded-lg p-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className={cn(
                'relative px-3.5 py-1 text-xs font-semibold uppercase tracking-wider transition-all duration-200 rounded',
                activeSection === link.href.substring(1)
                  ? 'text-landing-primary bg-landing-accent/20'
                  : 'text-landing-secondary hover:text-landing-primary hover:bg-landing-elevated/40'
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3">
          <RouterLink
            to="/auth/login"
            className="text-landing-secondary hover:text-landing-primary text-xs font-bold uppercase tracking-wider px-4 transition-colors"
          >
            Sign In
          </RouterLink>
          <RouterLink
            to="/auth/signup"
            className="btn-proper-primary text-[11px] py-2 px-4 cursor-pointer"
          >
            Start Free
            <ArrowRight className="w-3.5 h-3.5" />
          </RouterLink>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-landing-secondary hover:text-landing-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="absolute top-20 left-4 right-4 bg-landing-surface border border-landing-divider/50 rounded-lg md:hidden overflow-hidden pointer-events-auto shadow-2xl"
          >
            <div className="flex flex-col p-6 gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-sm font-bold uppercase tracking-wider text-landing-secondary hover:text-landing-primary py-2 px-3 rounded hover:bg-landing-elevated transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px bg-landing-divider/30 my-2" />
              <RouterLink 
                to="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-wider text-landing-secondary hover:text-landing-primary py-2 px-3 rounded text-center transition-colors"
              >
                Sign In
              </RouterLink>
              <RouterLink 
                to="/auth/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-proper-primary w-full py-3 cursor-pointer justify-center flex items-center gap-2"
              >
                Start Free <ArrowRight className="w-4 h-4" />
              </RouterLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
