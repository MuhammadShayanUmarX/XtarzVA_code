import { FileText, Type, Megaphone, Video } from 'lucide-react'

export default function ContentGeneration() {
  return (
    <section className="py-28 bg-landing-surface/30 relative border-t border-landing-divider/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-landing-accent">Ad Creative & Copy</span>
          <h2 className="text-3xl md:text-5xl font-black text-landing-primary tracking-tight leading-tight">
            Create scroll-stopping ads <br className="hidden md:block" />
            without hiring a creative team.
          </h2>
          <p className="text-landing-secondary text-lg">
            Get ready-to-use product descriptions, Facebook ad hooks, and TikTok scripts — all written to convert.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-landing-bg border border-landing-divider/30">
            <div className="flex items-center gap-3 mb-6">
              <Type className="w-5 h-5 text-landing-accent" />
              <h3 className="font-bold text-landing-primary">Product Title That Ranks</h3>
            </div>
            <div className="p-4 rounded-lg bg-landing-surface border border-landing-divider/20 text-sm text-landing-primary font-medium">
              Smart Posture Corrector Brace for Men & Women — Adjustable Back Support for Pain Relief
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-landing-bg border border-landing-divider/30">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-landing-accentSoft" />
              <h3 className="font-bold text-landing-primary">Description That Sells</h3>
            </div>
            <div className="p-4 rounded-lg bg-landing-surface border border-landing-divider/20 text-sm text-landing-secondary leading-relaxed">
              <strong>Relieve back pain instantly.</strong> Whether you sit at a desk all day or want to improve your posture, this adjustable brace pulls your shoulders back for all-day comfort.
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-landing-bg border border-landing-divider/30">
            <div className="flex items-center gap-3 mb-6">
              <Megaphone className="w-5 h-5 text-landing-accentLime" />
              <h3 className="font-bold text-landing-primary">Facebook Ad Hooks</h3>
            </div>
            <ul className="space-y-3">
              <li className="p-3 rounded-lg bg-landing-surface border border-landing-divider/20 text-sm text-landing-secondary">
                "Working from home ruining your back? Try this for 5 minutes a day."
              </li>
              <li className="p-3 rounded-lg bg-landing-surface border border-landing-divider/20 text-sm text-landing-secondary">
                "The $49 posture fix that chiropractors don't want you to know about."
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-2xl bg-landing-bg border border-landing-divider/30">
            <div className="flex items-center gap-3 mb-6">
              <Video className="w-5 h-5 text-[#E57373]" />
              <h3 className="font-bold text-landing-primary">TikTok / Reels Script</h3>
            </div>
            <div className="p-4 rounded-lg bg-landing-surface border border-landing-divider/20 text-sm text-landing-secondary space-y-2">
              <p><strong>Hook:</strong> Someone rubbing their neck in pain at a desk. "Desk job destroying your posture?"</p>
              <p><strong>Demo:</strong> Straps on the brace. Shoulders pull back instantly. "Instant relief in 5 seconds."</p>
              <p><strong>CTA:</strong> "Get yours 50% off today only. Link in bio!"</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
