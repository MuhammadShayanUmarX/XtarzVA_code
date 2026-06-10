import { FileText, Type, Megaphone, Video } from 'lucide-react'

const ICON = { strokeWidth: 1.5 as const, className: 'w-5 h-5 text-landing-accent' }

export default function ContentGeneration() {
  return (
    <section className="py-24 bg-landing-surface border-t border-landing-divider">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="section-eyebrow">Ad creative & copy</span>
          <h2 className="text-3xl md:text-4xl font-semibold text-landing-primary tracking-tight leading-tight">
            Create scroll-stopping ads{' '}
            <br className="hidden md:block" />
            without hiring a creative team.
          </h2>
          <p className="text-landing-secondary text-lg">
            Product descriptions, SEO titles, Facebook hooks, and short-form scripts — written to convert.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 landing-card">
            <div className="flex items-center gap-3 mb-5">
              <Type {...ICON} />
              <h3 className="font-semibold text-landing-primary">Product title that ranks</h3>
            </div>
            <div className="p-4 rounded-lg bg-landing-elevated border border-landing-divider text-sm text-landing-primary">
              Smart Posture Corrector Brace for Men & Women — Adjustable Back Support for Pain Relief
            </div>
          </div>

          <div className="p-8 landing-card">
            <div className="flex items-center gap-3 mb-5">
              <FileText {...ICON} />
              <h3 className="font-semibold text-landing-primary">Description that sells</h3>
            </div>
            <div className="p-4 rounded-lg bg-landing-elevated border border-landing-divider text-sm text-landing-secondary leading-relaxed">
              <strong className="text-landing-primary">Relieve back pain instantly.</strong> Whether you sit at a desk all day or want to improve your posture, this adjustable brace pulls your shoulders back for all-day comfort.
            </div>
          </div>

          <div className="p-8 landing-card">
            <div className="flex items-center gap-3 mb-5">
              <Megaphone {...ICON} />
              <h3 className="font-semibold text-landing-primary">Facebook ad hooks</h3>
            </div>
            <ul className="space-y-3">
              <li className="p-3 rounded-lg bg-landing-elevated border border-landing-divider text-sm text-landing-secondary">
                &quot;Working from home ruining your back? Try this for 5 minutes a day.&quot;
              </li>
              <li className="p-3 rounded-lg bg-landing-elevated border border-landing-divider text-sm text-landing-secondary">
                &quot;The $49 posture fix that chiropractors don&apos;t want you to know about.&quot;
              </li>
            </ul>
          </div>

          <div className="p-8 landing-card">
            <div className="flex items-center gap-3 mb-5">
              <Video {...ICON} />
              <h3 className="font-semibold text-landing-primary">TikTok / Reels script</h3>
            </div>
            <div className="p-4 rounded-lg bg-landing-elevated border border-landing-divider text-sm text-landing-secondary space-y-2">
              <p><strong className="text-landing-primary">Hook:</strong> Desk worker rubbing their neck. &quot;Desk job destroying your posture?&quot;</p>
              <p><strong className="text-landing-primary">Demo:</strong> Straps on the brace. &quot;Instant relief in 5 seconds.&quot;</p>
              <p><strong className="text-landing-primary">CTA:</strong> &quot;Get yours today. Link in bio.&quot;</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
