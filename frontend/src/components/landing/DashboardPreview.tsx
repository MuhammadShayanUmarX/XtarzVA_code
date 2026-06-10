export default function DashboardPreview() {
  return (
    <section className="pb-24 pt-0 bg-landing-bg relative">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-landing-muted mb-6">
          Your command center
        </p>

        <div className="landing-panel border border-landing-divider/40 overflow-hidden shadow-2xl">
          <div className="px-4 py-3 bg-landing-surface/90 border-b border-landing-divider/40 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 max-w-md mx-auto">
              <div className="bg-landing-bg/60 rounded-md px-3 py-1 text-[10px] text-landing-muted text-center font-mono truncate">
                app.xtarzva.com/dashboard
              </div>
            </div>
          </div>

          <img
            src="/Dashbaord.png"
            alt="XtarzVA dashboard preview — product research, competitor analysis, and store analytics in one place"
            className="w-full h-auto block"
            loading="eager"
          />
        </div>
      </div>
    </section>
  )
}
