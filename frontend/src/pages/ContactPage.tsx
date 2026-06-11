import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Mail, MessageSquare, MapPin, Clock, ArrowLeft, Send, CheckCircle2, Zap } from 'lucide-react'
import api from '../lib/api'
import { toast } from 'react-hot-toast'
import { XtarzLogo } from '../components/ui/XtarzLogo'

const TOPICS = [
  'General Enquiry',
  'Sales & Pricing',
  'Technical Support',
  'Partnership / Agency',
  'Bug Report',
  'Feature Request',
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg('Please fill in all required fields.')
      return
    }

    setSending(true)
    try {
      await api.post('/v2/contact/submit', {
        name: form.name.trim(),
        email: form.email.trim(),
        topic: form.topic,
        message: form.message.trim()
      })
      setSent(true)
      toast.success('Your message has been sent successfully!')
    } catch (err: any) {
      console.error(err)
      const msg = err.response?.data?.detail || 'Failed to send message. Please try again later.'
      setErrorMsg(msg)
      toast.error(msg)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-950 text-brand-50 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-accent-primary/[0.06] blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-accent-violet/[0.05] blur-[120px] rounded-full" />
      </div>
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Nav */}
      <header className="sticky top-0 z-50 h-16 flex items-center px-6 border-b border-white/[0.05] bg-brand-950/80 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2 text-brand-400 hover:text-brand-50 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to XtarzVA
        </Link>
        <Link to="/" className="ml-6">
          <XtarzLogo textClassName="text-sm font-bold text-brand-50" />
        </Link>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-20">

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="section-label block mb-4">Contact Us</span>
          <h1 className="text-4xl md:text-5xl font-black text-brand-50 tracking-tighter leading-tight mb-4">
            Let's build something{' '}
            <span className="gradient-text">great together.</span>
          </h1>
          <p className="text-lg text-brand-400 max-w-xl mx-auto">
            Have a question, want a demo, or exploring an agency plan? We reply within 2 hours during business hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: Info cards */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            {[
              {
                icon: Mail, title: 'Email us',
                desc: 'For general enquiries and partnerships.',
                val: 'info@xtarzva.site', accentColor: '#4f6ef7',
              },
              {
                icon: MessageSquare, title: 'Live chat',
                desc: 'Available Mon–Fri, 9am–6pm GMT.',
                val: 'Start a conversation →', accentColor: '#10b981',
              },
              {
                icon: Clock, title: 'Response time',
                desc: 'We reply within 2 business hours.',
                val: 'Avg. response: 47 minutes', accentColor: '#a78bfa',
              },
              {
                icon: MapPin, title: 'Headquarters',
                desc: 'Registered company.',
                val: 'Islamabad, Pakistan 🇵🇰', accentColor: '#22d3ee',
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.06] bg-brand-800/30 hover:bg-brand-800/50 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${card.accentColor}14`, border: `1px solid ${card.accentColor}25`, color: card.accentColor }}
                >
                  <card.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-black text-brand-50">{card.title}</p>
                  <p className="text-[12px] text-brand-500 mb-1">{card.desc}</p>
                  <p className="text-[13px] font-semibold" style={{ color: card.accentColor }}>{card.val}</p>
                </div>
              </motion.div>
            ))}

            {/* Shopify badge */}
            <div className="p-5 rounded-2xl border border-[#96bf48]/20 bg-[#96bf48]/[0.04]">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-[#96bf48]" />
                <span className="text-[11px] font-black text-[#96bf48] uppercase tracking-widest">Shopify-First</span>
              </div>
              <p className="text-sm text-brand-400 leading-relaxed">
                XtarzVA is built exclusively for <strong className="text-[#96bf48]">Shopify</strong> merchants.
                If you're running another platform, we're not a fit — yet.
              </p>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-white/[0.07] bg-brand-800/30 backdrop-blur-sm p-8">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-accent-emerald" />
                  </div>
                  <h3 className="text-xl font-black text-brand-50 mb-2">Message sent!</h3>
                  <p className="text-brand-400 text-sm max-w-xs mx-auto">
                    We'll get back to you within 2 hours. Check your inbox at <strong className="text-white">{form.email}</strong>.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', topic: TOPICS[0], message: '' }) }}
                    className="mt-8 text-sm font-bold text-accent-primary hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="p-3 bg-[#fb7185]/10 border border-[#fb7185]/20 text-[#fb7185] rounded-lg text-xs font-semibold">
                      {errorMsg}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-[11px] font-black text-brand-500 uppercase tracking-wider mb-2">Full Name</label>
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full h-11 bg-brand-900/60 border border-white/[0.08] rounded-xl px-4 text-sm text-white placeholder-brand-600 focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/20 transition-all"
                      />
                    </div>
                    {/* Email */}
                    <div>
                      <label className="block text-[11px] font-black text-brand-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        required
                        type="email"
                        placeholder="you@yourstore.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full h-11 bg-brand-900/60 border border-white/[0.08] rounded-xl px-4 text-sm text-white placeholder-brand-600 focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Topic */}
                  <div>
                    <label className="block text-[11px] font-black text-brand-500 uppercase tracking-wider mb-2">Topic</label>
                    <select
                      value={form.topic}
                      onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                      className="w-full h-11 bg-brand-900/60 border border-white/[0.08] rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent-primary/50 transition-all appearance-none cursor-pointer"
                    >
                      {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[11px] font-black text-brand-500 uppercase tracking-wider mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us about your Shopify store, current challenges, or what you'd like to achieve with XtarzVA..."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full bg-brand-900/60 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-brand-600 focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/20 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full h-12 rounded-xl text-sm font-black text-brand-50 flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #4f6ef7, #a78bfa)', boxShadow: '0 0 24px rgba(79,110,247,0.3)' }}
                  >
                    {sending ? (
                      <>
                        <span className="w-4 h-4 border-2 border-brand-600 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-brand-600">
                    By sending, you agree to our{' '}
                    <Link to="/privacy" className="text-brand-400 hover:text-brand-50 transition-colors">Privacy Policy</Link>.
                    We never share your data.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
