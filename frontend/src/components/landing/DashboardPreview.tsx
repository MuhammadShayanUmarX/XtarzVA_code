export default function DashboardPreview() {
  return (
    <section id="demo" className="pb-24 pt-4 bg-landing-bg relative">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center section-eyebrow mb-6">
          Your store command center
        </p>

        <div className="landing-panel overflow-hidden">
          <div className="px-4 py-3 bg-landing-elevated border-b border-landing-divider flex items-center justify-center">
            <div className="text-xs text-landing-muted font-mono truncate">
              app.xtarzva.com/dashboard
            </div>
          </div>

          <img
            src="/Dashbaord.png"
            alt="XtarzVA dashboard — product research, margins, and store workflow"
            className="w-full h-auto block"
            loading="eager"
          />
        </div>
      </div>
    </section>
  )
}
