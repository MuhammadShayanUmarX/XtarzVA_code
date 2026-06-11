import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../lib/api'

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!currentPassword || newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    setSaving(true)
    try {
      await api.post('/v2/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      })
      toast.success('Password updated')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      toast.error(typeof msg === 'string' ? msg : 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-10">
      <section className="glass-panel p-8 space-y-10">
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white tracking-tight">Security</h3>
          <p className="text-sm text-landing-muted font-medium">Manage your password and authentication.</p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-landing-muted tracking-tight px-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 bg-white/[0.02] border border-landing-divider rounded-2xl px-6 text-sm text-white focus:outline-none focus:border-landing-accent transition-all font-bold"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-landing-muted tracking-tight px-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full h-14 bg-white/[0.02] border border-landing-divider rounded-2xl px-6 text-sm text-white focus:outline-none focus:border-landing-accent transition-all font-bold"
              />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-accent-amber/5 border border-accent-amber/10 flex items-center gap-4">
            <AlertTriangle size={20} className="text-accent-amber shrink-0" />
            <p className="text-xs text-landing-secondary font-medium">
              Changing your password will sign you out of other sessions when token refresh is enabled.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-landing-divider flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || !currentPassword || newPassword.length < 8}
            className="h-14 px-10 rounded-2xl border border-landing-divider text-white text-sm font-black hover:bg-white/5 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
          </button>
        </div>
      </section>
    </div>
  )
}
