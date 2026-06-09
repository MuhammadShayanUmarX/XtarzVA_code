import { cn } from '../../../lib/utils'

export default function DangerZone() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="space-y-2">
        <h2 className="text-3xl font-black text-accent-rose tracking-tight">Danger Zone</h2>
        <p className="text-lg text-landing-secondary font-medium">Irreversible account actions.</p>
      </header>

      <div className="glass-panel border-accent-rose/20 overflow-hidden divide-y divide-white/5">
        {[
          { t: 'Export Data', d: 'Download all your run history and research data as JSON.', b: 'Export' },
          { t: 'Delete All History', d: 'Permanently remove all research logs and scan history.', b: 'Delete History', danger: true },
          { t: 'Delete Account', d: 'Permanently delete your account and all associated data.', b: 'Delete Account', danger: true },
        ].map(z => (
          <div key={z.t} className="p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 transition-colors hover:bg-accent-rose/[0.03]">
            <div className="space-y-3">
              <p className="text-xl font-black text-white tracking-tight">{z.t}</p>
              <p className="text-sm text-landing-muted leading-relaxed font-medium max-w-lg">{z.d}</p>
            </div>
            <button className={cn(
              "px-8 h-14 rounded-2xl text-xs font-black transition-all whitespace-nowrap tracking-tight",
              z.danger ? "bg-accent-rose/10 text-accent-rose border border-accent-rose/20 hover:bg-accent-rose hover:text-white" : "bg-white/5 text-landing-secondary border border-landing-divider hover:border-landing-divider"
            )}>
              {z.b}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
