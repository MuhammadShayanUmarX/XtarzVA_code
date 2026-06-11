import { Key } from 'lucide-react'

export default function APISettings() {
  return (
    <div className="space-y-12">
      <section className="glass-panel p-10 space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Key size={120} className="text-landing-accent" />
        </div>

        <div className="space-y-4 relative z-10">
          <h2 className="text-xl font-black text-white tracking-tight">API Keys</h2>
          <p className="text-sm text-landing-muted font-medium leading-relaxed max-w-xl">
            Public API access for custom integrations is not enabled on your account yet.
            Use the dashboard and agents directly for now.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/[0.02] border border-landing-divider relative z-10 space-y-2">
          <p className="text-sm font-black text-white">No API keys issued</p>
          <p className="text-xs text-landing-muted">
            When API access launches, you will generate and rotate keys here.
          </p>
        </div>
      </section>
    </div>
  )
}
