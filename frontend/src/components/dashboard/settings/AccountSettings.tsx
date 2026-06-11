import { useEffect, useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCurrentUser } from '../../../hooks/useCurrentUser'
import { getInitials, getPlanLabel } from '../../../lib/plans'

export default function AccountSettings() {
  const { user, loading, updateUser } = useCurrentUser()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) setName(user.name)
  }, [user])

  const handleSave = async () => {
    if (!user || !name.trim()) return
    setSaving(true)
    try {
      await updateUser({ name: name.trim() })
      toast.success('Profile updated')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      toast.error(typeof msg === 'string' ? msg : 'Failed to update profile')
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

  if (!user) {
    return <p className="text-sm text-landing-muted">Unable to load account profile.</p>
  }

  const initials = getInitials(user.name, user.email)
  const planLabel = getPlanLabel(user.plan)

  return (
    <div className="space-y-10">
      <section className="glass-panel p-8 space-y-10">
        <div className="flex items-center gap-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-accent-primary to-accent-violet flex items-center justify-center text-white text-3xl font-black border-[4px] border-landing-divider shadow-2xl overflow-hidden relative">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <span className="relative z-10">{initials}</span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <Upload size={24} className="text-white" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white tracking-tight">{user.name}</h3>
            <p className="text-[10px] text-landing-muted font-black tracking-tight">{planLabel} Plan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-landing-muted tracking-tight px-1">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-14 bg-white/[0.02] border border-landing-divider rounded-2xl px-6 text-sm text-white focus:outline-none focus:border-landing-accent transition-all font-bold"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-landing-muted tracking-tight px-1">Email</label>
            <input
              value={user.email}
              readOnly
              className="w-full h-14 bg-white/[0.02] border border-landing-divider rounded-2xl px-6 text-sm text-landing-muted focus:outline-none font-bold cursor-not-allowed"
            />
          </div>
        </div>

        <div className="pt-8 border-t border-landing-divider flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || !name.trim() || name.trim() === user.name}
            className="h-14 px-10 rounded-2xl bg-white text-landing-muted text-sm font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {saving ? 'Saving…' : 'Update Identity Profile'}
          </button>
        </div>
      </section>
    </div>
  )
}
