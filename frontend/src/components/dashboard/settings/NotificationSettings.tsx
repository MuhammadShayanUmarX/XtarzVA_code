import { useEffect, useState } from 'react'
import { Zap, CheckCircle2, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react'
import * as Switch from '@radix-ui/react-switch'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import type { UserPreferences } from '../../../types/user'

const DEFAULT_PREFS: Record<string, boolean> = {
  email: true,
  push: false,
  mission_start: true,
  mission_complete: true,
  error_alerts: true,
  margin_alerts: true,
}

const CHANNELS = [
  { id: 'email', label: 'Email Reports', desc: 'Weekly intelligence summaries.' },
  { id: 'push', label: 'Browser Push', desc: 'Real-time run status updates.' },
]

const EVENTS = [
  { id: 'mission_start', label: 'Run Started', icon: Zap },
  { id: 'mission_complete', label: 'Run Completed', icon: CheckCircle2 },
  { id: 'error_alerts', label: 'Run Failures', icon: AlertTriangle },
  { id: 'margin_alerts', label: 'High-Margin Opportunities', icon: TrendingUp },
]

export default function NotificationSettings() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(DEFAULT_PREFS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get<UserPreferences>('/v2/auth/preferences')
      .then(res => {
        setPrefs({ ...DEFAULT_PREFS, ...(res.data.notification_prefs || {}) })
      })
      .catch(() => setPrefs(DEFAULT_PREFS))
      .finally(() => setLoading(false))
  }, [])

  const toggle = (key: string) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.patch('/v2/auth/preferences', { notification_prefs: prefs })
      toast.success('Notification preferences saved')
    } catch {
      toast.error('Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 text-landing-accent animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <section className="glass-panel p-8 space-y-10">
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white tracking-tight">Notification Channels</h3>
          <p className="text-sm text-landing-muted font-medium">Configure how XtarzVA communicates with you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CHANNELS.map(item => (
            <div key={item.id} className="p-6 rounded-3xl bg-white/[0.01] border border-landing-divider flex items-center justify-between group hover:bg-white/[0.03] transition-all">
              <div className="space-y-1">
                <p className="text-sm font-black text-white tracking-tight">{item.label}</p>
                <p className="text-[10px] text-landing-muted font-medium">{item.desc}</p>
              </div>
              <Switch.Root
                checked={Boolean(prefs[item.id])}
                onCheckedChange={() => toggle(item.id)}
                className="w-11 h-6 rounded-full relative bg-landing-elevated data-[state=checked]:bg-landing-accent transition-colors outline-none cursor-default shadow-inner"
              >
                <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-1 will-change-transform data-[state=checked]:translate-x-[1.25rem]" />
              </Switch.Root>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel p-8 space-y-10">
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white tracking-tight">Event Alerts</h3>
          <p className="text-sm text-landing-muted font-medium">Select which events trigger a notification.</p>
        </div>

        <div className="space-y-4">
          {EVENTS.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 px-6 rounded-2xl hover:bg-white/[0.02] transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-landing-muted group-hover:text-landing-accent transition-colors">
                  <item.icon size={18} />
                </div>
                <span className="text-sm font-bold text-landing-secondary">{item.label}</span>
              </div>
              <Switch.Root
                checked={Boolean(prefs[item.id])}
                onCheckedChange={() => toggle(item.id)}
                className="w-11 h-6 rounded-full relative bg-landing-elevated data-[state=checked]:bg-landing-accent transition-colors outline-none cursor-default shadow-inner"
              >
                <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-1 will-change-transform data-[state=checked]:translate-x-[1.25rem]" />
              </Switch.Root>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="h-14 px-10 rounded-2xl bg-white text-landing-muted text-sm font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Preferences'}
        </button>
      </div>
    </div>
  )
}
