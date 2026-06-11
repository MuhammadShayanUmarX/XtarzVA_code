import { motion } from 'framer-motion'
import { PageShell } from './InfoPages'

const LEGAL_CARD = 'landing-card p-8'

export default function TermsOfService() {
  const sections = [
    { title: '1. Agreement to Terms', content: 'By accessing or using XtarzVA, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.' },
    { title: '2. Accounts', content: 'When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.' },
    { title: '3. Intellectual Property', content: 'The Service and its original content, features, and functionality are and will remain the exclusive property of XtarzVA and its licensors.' },
    { title: '4. Limitation of Liability', content: 'In no event shall XtarzVA, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages.' },
  ]

  return (
    <PageShell
      label="Legal"
      title={<>Terms of <span className="gradient-text">Service</span></>}
      subtitle={`Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
    >
      <div className="space-y-6">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={LEGAL_CARD}
          >
            <h2 className="text-lg font-semibold text-landing-primary mb-3">{section.title}</h2>
            <p className="text-landing-secondary leading-relaxed text-sm">{section.content}</p>
          </motion.div>
        ))}
      </div>
    </PageShell>
  )
}
