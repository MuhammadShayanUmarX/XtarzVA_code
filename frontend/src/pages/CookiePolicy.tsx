import { motion } from 'framer-motion'
import { PageShell } from './InfoPages'

export default function CookiePolicy() {
  const sections = [
    { title: '1. What are Cookies?', content: 'Cookies are small text files stored on your device that help us provide a better experience. They allow us to remember your preferences and understand how you interact with our platform.' },
    { title: '2. Types of Cookies We Use', content: 'We use essential cookies for platform functionality, analytical cookies to track usage trends, and preference cookies to remember your settings.' },
    { title: '3. Managing Cookies', content: 'Most web browsers allow you to control cookies through their settings. However, disabling essential cookies may limit your ability to use certain features of XtarzVA.' },
  ]

  return (
    <PageShell 
      label="Legal" 
      title={<>Cookie <span className="gradient-text">Policy.</span></>} 
      subtitle={`Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
    >
      <div className="space-y-8">
        {sections.map((section, i) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-8 rounded-2xl border border-white/[0.07] bg-brand-800/30">
            <h2 className="text-xl font-black text-white mb-4">{section.title}</h2>
            <p className="text-brand-400 leading-relaxed text-sm">{section.content}</p>
          </motion.div>
        ))}
      </div>
    </PageShell>
  )
}
