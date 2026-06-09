import { motion } from 'framer-motion'
import { PageShell } from './InfoPages'

export default function PrivacyPolicy() {
  const sections = [
    { title: '1. Introduction', content: 'XtarzVA ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.' },
    { title: '2. Information We Collect', content: 'We collect personal information that you voluntarily provide to us when you register for an account, such as your name, email address, and Shopify store URL. We also automatically collect device information, IP addresses, and usage data through cookies.' },
    { title: '3. How We Use Data', content: 'Your data is used to provide and improve the Service, process transactions, send technical updates, and analyze platform performance. We do not sell your personal data to third parties.' },
    { title: '4. Shopify Integration', content: 'When you connect your Shopify store, we access only the data necessary to perform product analysis and auto-publishing. We do not store your customer data or payment information beyond what is required for Service functionality.' },
  ]

  return (
    <PageShell 
      label="Legal" 
      title={<>Privacy <span className="gradient-text">Policy.</span></>} 
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
        <div className="text-center pt-8">
          <p className="text-xs text-brand-600">Questions about your privacy? Email us at privacy@xtarzva.com</p>
        </div>
      </div>
    </PageShell>
  )
}

