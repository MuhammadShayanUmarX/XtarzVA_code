import RunsHistoryList from '../../components/dashboard/RunsHistoryList'
import { History, Filter } from 'lucide-react'

export default function RunsHistoryPage() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-32">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-landing-surface border border-landing-divider flex items-center justify-center text-landing-secondary">
              <History size={24} />
            </div>
            <h1 className="text-4xl font-black text-landing-primary tracking-tight">Intelligence Archive</h1>
          </div>
          <p className="text-lg text-landing-secondary font-medium leading-relaxed max-w-2xl">
            Chronological record of all agent runs across Product Discovery, Intel, Sourcing, and Store Builder.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 px-6 h-14 bg-landing-surface border border-landing-divider rounded-2xl hover:border-landing-divider transition-all text-sm font-black text-landing-primary">
            <Filter size={18} className="text-landing-muted" />
            Filter Archive
          </button>
        </div>
      </header>

      <RunsHistoryList />
    </div>
  )
}
