import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { cn } from '../../../lib/utils'
import api from '../../../lib/api'
import { useSession } from '../../../store/session'

export default function DangerZone() {
  const navigate = useNavigate()
  const { clear } = useSession()
  const [exporting, setExporting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await api.get('/v2/runs/')
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `xtarzva-runs-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Run history exported')
    } catch {
      toast.error('Failed to export data')
    } finally {
      setExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Permanently delete your account and all data? This cannot be undone.')) return
    setDeleting(true)
    try {
      await api.delete('/v2/auth/me')
      clear()
      toast.success('Account deleted')
      navigate('/')
    } catch {
      toast.error('Failed to delete account')
    } finally {
      setDeleting(false)
    }
  }

  const zones = [
    { t: 'Export Data', d: 'Download all your run history as JSON.', b: exporting ? 'Exporting…' : 'Export', onClick: handleExport, disabled: exporting },
    { t: 'Delete Account', d: 'Permanently delete your account and all associated data.', b: deleting ? 'Deleting…' : 'Delete Account', danger: true, onClick: handleDeleteAccount, disabled: deleting },
  ]

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="space-y-2">
        <h2 className="text-3xl font-black text-accent-rose tracking-tight">Danger Zone</h2>
        <p className="text-lg text-landing-secondary font-medium">Irreversible account actions.</p>
      </header>

      <div className="glass-panel border-accent-rose/20 overflow-hidden divide-y divide-white/5">
        {zones.map(z => (
          <div key={z.t} className="p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 transition-colors hover:bg-accent-rose/[0.03]">
            <div className="space-y-3">
              <p className="text-xl font-black text-white tracking-tight">{z.t}</p>
              <p className="text-sm text-landing-muted leading-relaxed font-medium max-w-lg">{z.d}</p>
            </div>
            <button
              onClick={z.onClick}
              disabled={z.disabled}
              className={cn(
                'px-8 h-14 rounded-2xl text-xs font-black transition-all whitespace-nowrap tracking-tight disabled:opacity-50',
                z.danger
                  ? 'bg-accent-rose/10 text-accent-rose border border-accent-rose/20 hover:bg-accent-rose hover:text-white'
                  : 'bg-white/5 text-landing-secondary border border-landing-divider hover:border-landing-divider'
              )}
            >
              {z.b}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
