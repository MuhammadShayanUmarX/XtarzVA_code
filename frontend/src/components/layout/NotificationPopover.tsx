import { useEffect, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Bell, CheckCircle2, AlertCircle, Zap, ArrowRight, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import api from '../../lib/api'

interface Notification {
  id: string
  title: string
  description: string
  time: string
  type: 'success' | 'warning' | 'info' | 'system'
  read: boolean
  runId?: string
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function runToNotification(run: {
  id: string
  name: string
  status: string
  query?: string
  current_stage?: string
  created_at: string
}): Notification {
  const label = run.query || run.name
  if (run.status === 'completed') {
    return {
      id: run.id,
      title: 'Run completed',
      description: `"${label}" finished successfully.`,
      time: relativeTime(run.created_at),
      type: 'success',
      read: true,
      runId: run.id,
    }
  }
  if (run.status === 'failed') {
    return {
      id: run.id,
      title: 'Run failed',
      description: `"${label}" encountered an error.`,
      time: relativeTime(run.created_at),
      type: 'warning',
      read: false,
      runId: run.id,
    }
  }
  if (run.status === 'running') {
    return {
      id: run.id,
      title: 'Run in progress',
      description: `"${label}" is running (${(run.current_stage || 'agent').replace(/_/g, ' ')}).`,
      time: relativeTime(run.created_at),
      type: 'info',
      read: false,
      runId: run.id,
    }
  }
  return {
    id: run.id,
    title: 'Run update',
    description: `"${label}" — status: ${run.status}.`,
    time: relativeTime(run.created_at),
    type: 'system',
    read: true,
    runId: run.id,
  }
}

export default function NotificationPopover() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/v2/stats/overview')
      .then(res => {
        const runs = res.data.recent_runs || []
        setNotifications(runs.map(runToNotification))
      })
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false))
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="relative w-14 h-14 flex items-center justify-center text-landing-secondary hover:text-white transition-all bg-white/[0.03] rounded-2xl border border-landing-divider hover:border-white/15 group">
          <Bell size={22} className="group-hover:scale-110 transition-transform" />
          {unreadCount > 0 && (
            <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-landing-accent rounded-full border-2 border-landing-divider animate-pulse" />
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={12}
          className="w-[380px] glass-panel p-0 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        >
          <div className="p-6 border-b border-landing-divider flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-landing-accent/10 flex items-center justify-center text-landing-accent">
                <Bell size={16} />
              </div>
              <h3 className="font-black text-sm text-white tracking-tight">Notifications</h3>
            </div>
            {unreadCount > 0 && (
              <span className="text-[10px] font-black text-landing-muted tracking-tight bg-white/5 px-2 py-1 rounded">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 text-landing-accent animate-spin" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-white/5">
                {notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => notif.runId && navigate(`/dashboard/workflow?run_id=${notif.runId}`)}
                    className={cn(
                      'w-full text-left p-6 transition-all hover:bg-white/[0.03] group relative overflow-hidden',
                      !notif.read && 'bg-landing-accent/[0.02]'
                    )}
                  >
                    {!notif.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-landing-accent" />
                    )}

                    <div className="flex gap-4">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border',
                        notif.type === 'success' && 'bg-accent-emerald/10 border-accent-emerald/20 text-accent-emerald',
                        notif.type === 'warning' && 'bg-accent-amber/10 border-accent-amber/20 text-accent-amber',
                        notif.type === 'info' && 'bg-accent-cyan/10 border-accent-cyan/20 text-accent-cyan',
                        notif.type === 'system' && 'bg-accent-violet/10 border-accent-violet/20 text-accent-violet'
                      )}>
                        {notif.type === 'success' && <CheckCircle2 size={18} />}
                        {notif.type === 'warning' && <AlertCircle size={18} />}
                        {notif.type === 'info' && <Zap size={18} />}
                        {notif.type === 'system' && <Bell size={18} />}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-white">{notif.title}</p>
                          <span className="text-[10px] font-medium text-landing-muted">{notif.time}</span>
                        </div>
                        <p className="text-xs text-landing-secondary leading-relaxed font-medium">
                          {notif.description}
                        </p>

                        {notif.runId && (
                          <div className="pt-2 flex items-center gap-2 text-[10px] font-black text-landing-accent tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">
                            View run <ArrowRight size={12} />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto text-landing-muted">
                  <Bell size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-white tracking-tight">No notifications</p>
                  <p className="text-xs text-landing-muted font-medium">Run a scan to see activity here.</p>
                </div>
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
