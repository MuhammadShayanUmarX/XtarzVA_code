import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import api from '../../../lib/api'
import type { BillingInfo } from '../../../types/user'

export default function BillingSettings() {
  const [billing, setBilling] = useState<BillingInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<BillingInfo>('/v2/auth/billing')
      .then(res => setBilling(res.data))
      .catch(() => setBilling(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 text-landing-accent animate-spin" />
      </div>
    )
  }

  if (!billing) {
    return <p className="text-sm text-landing-muted">Unable to load billing information.</p>
  }

  const totalCredits = billing.plan_credits + billing.bonus_credits
  const usagePct = totalCredits > 0 ? Math.min(100, (billing.used_credits / totalCredits) * 100) : 0
  const resetDate = new Date(billing.reset_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="p-10 rounded-[40px] glass-panel bg-gradient-to-br from-accent-primary/20 via-brand-900 to-brand-900 space-y-8 relative overflow-hidden border-landing-accent/30 shadow-[0_20px_60px_rgba(79,110,247,0.15)]">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-landing-accent/20 blur-[60px] pointer-events-none" />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-white tracking-tighter">{billing.plan_label} Plan</span>
              <span className="px-3 py-1 rounded-full bg-landing-accent text-[10px] font-black tracking-tight">Active</span>
            </div>
            <p className="text-landing-secondary font-bold">
              ${billing.plan_price.toFixed(0)}.00 / Billing Cycle
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <p className="text-[10px] font-black text-landing-muted tracking-tight">Run Capacity Usage</p>
              <p className="text-sm font-black text-white">
                {billing.used_credits} / {totalCredits} Runs
              </p>
            </div>
            <div className="h-3 bg-landing-bg rounded-full overflow-hidden border border-landing-divider relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${usagePct}%` }}
                transition={{ duration: 1.5, ease: 'circOut' }}
                className="h-full bg-landing-accent rounded-full"
              />
            </div>
            <p className="text-[10px] text-landing-muted">
              {billing.remaining_credits} run{billing.remaining_credits !== 1 ? 's' : ''} remaining · Resets {resetDate}
            </p>
          </div>

          <Link
            to="/pricing"
            className="w-full h-14 bg-white text-landing-muted rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center"
          >
            View Upgrade Options
          </Link>
        </div>

        <div className="p-10 rounded-[40px] glass-panel space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-landing-muted tracking-tight">Payment</p>
            <p className="text-sm text-landing-secondary leading-relaxed">
              Payment processing is not connected yet. Your plan and run credits are managed on your XtarzVA account.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-landing-divider space-y-2">
            <p className="text-base font-black text-white">{billing.plan_label} Plan</p>
            <p className="text-xs text-landing-muted">
              {billing.plan_credits} monthly runs
              {billing.bonus_credits > 0 ? ` + ${billing.bonus_credits} bonus` : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
