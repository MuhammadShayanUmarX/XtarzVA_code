import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Target,
  TrendingUp,
  Package,
  Zap,
  MessageSquare,
  ChevronRight,
  Network,
  Play,
  Terminal as TerminalIcon,
  Loader2,
  LucideIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import api from '../../lib/api'
import type { AgentStat } from '../../types/user'

const AGENT_UI: Record<string, { icon: LucideIcon; color: string; feed: string[] }> = {
  product_intelligence: {
    icon: Search,
    color: 'cyan',
    feed: [
      'Market discovery across TikTok, Reddit, and marketplaces',
      'Identifies high-margin viral products',
      'Validates trend signals and search volume',
      'Computes estimated profit margins',
    ],
  },
  competitor_intelligence: {
    icon: Target,
    color: 'rose',
    feed: [
      'Maps pricing and positioning across competitors',
      'Analyzes review sentiment and pain points',
      'Identifies market gaps and SEO opportunities',
      'Benchmarks against established brands',
    ],
  },
  product_sourcing: {
    icon: Package,
    color: 'indigo',
    feed: [
      'Scans supplier platforms for reliable vendors',
      'Calculates unit costs and MOQ requirements',
      'Ranks suppliers by trust score and speed',
    ],
  },
  meta_ads_spy: {
    icon: Zap,
    color: 'violet',
    feed: [
      'SEO titles, meta descriptions, and Shopify tags',
      'Ad hooks, UGC scripts, and Meta ad units',
      'Competitor ad research',
      'Creative images via Google Imagen',
    ],
  },
  commerce_creation: {
    icon: TrendingUp,
    color: 'emerald',
    feed: [
      'Builds uploadable Shopify OS 2.0 theme ZIP',
      'Populates sections, templates, and settings',
      'Merges ad copy into product import JSON',
    ],
  },
}

export default function AgentStatusPage() {
  const navigate = useNavigate()
  const [agents, setAgents] = useState<AgentStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/v2/stats/agents')
      .then(res => setAgents(res.data.agents || []))
      .catch(() => setAgents([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-landing-accent animate-spin" />
      </div>
    )
  }

  const onlineCount = agents.length

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-landing-accent/10 border border-landing-accent/20 flex items-center justify-center text-landing-accent">
              <Network size={24} />
            </div>
            <h1 className="text-4xl font-black text-landing-primary tracking-tight">Commerce OS Engines</h1>
          </div>
          <p className="text-lg text-landing-secondary font-medium leading-relaxed max-w-2xl">
            Monitor the core intelligence and execution engines powering your storefront.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-landing-surface border border-landing-divider p-4 rounded-3xl">
          <div className="flex -space-x-3">
            {agents.map((a) => {
              const ui = AGENT_UI[a.id]
              const Icon = ui?.icon || Search
              return (
                <div key={a.id} className={cn('w-10 h-10 rounded-full border-2 border-landing-divider flex items-center justify-center bg-landing-surface', ui ? `text-accent-${ui.color}` : 'text-landing-muted')}>
                  <Icon size={16} />
                </div>
              )
            })}
          </div>
          <div className="pr-4 border-r border-landing-divider">
            <p className="text-[10px] font-black text-landing-muted tracking-tight">System Health</p>
            <p className="text-sm font-black text-accent-emerald">Optimal</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-landing-muted tracking-tight">Total Agents</p>
            <p className="text-sm font-black text-landing-primary tabular-nums">{onlineCount} Online</p>
          </div>
          <div className="w-px h-10 bg-landing-surface mx-2" />
          <button
            onClick={() => navigate('/dashboard/workflow')}
            className="cta-button h-12 px-6 rounded-2xl text-xs flex items-center gap-2 group"
          >
            <Play size={14} className="fill-current group-hover:scale-110 transition-transform" />
            Start Full Workflow
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {agents.map((agent, i) => {
          const ui = AGENT_UI[agent.id] || { icon: Search, color: 'cyan', feed: [agent.goal] }
          const Icon = ui.icon
          const successLabel = agent.success_rate != null ? `${agent.success_rate}%` : '—'

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel overflow-hidden flex flex-col group h-full relative"
            >
              <div className={cn('absolute top-0 left-0 w-32 h-32 blur-[100px] opacity-10 pointer-events-none', `bg-accent-${ui.color}`)} />

              <div className="p-8 border-b border-landing-divider relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110 duration-500', `bg-accent-${ui.color}/10 border-accent-${ui.color}/20 text-accent-${ui.color}`)}>
                    <Icon size={28} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-landing-muted tracking-tight mb-1.5">{agent.status}</span>
                    <div className={cn('w-2 h-2 rounded-full', agent.status === 'running' ? 'bg-accent-cyan animate-pulse' : agent.status === 'done' ? 'bg-accent-emerald' : 'bg-landing-elevated')} />
                  </div>
                </div>
                <h3 className="text-xl font-black text-landing-primary tracking-tight">{agent.name}</h3>
                <p className="text-xs text-landing-muted mt-1">{agent.role}</p>
              </div>

              <div className="p-8 grid grid-cols-3 gap-6 border-b border-landing-divider relative z-10">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-landing-muted tracking-tight">Runs</p>
                  <p className="text-base font-black text-landing-primary tabular-nums">{agent.tasks}</p>
                </div>
                <div className="space-y-1 border-x border-landing-divider px-4">
                  <p className="text-[9px] font-black text-landing-muted tracking-tight">Completed</p>
                  <p className="text-base font-black text-landing-primary tabular-nums">{agent.completed}</p>
                </div>
                <div className="space-y-1 pl-4">
                  <p className="text-[9px] font-black text-landing-muted tracking-tight">Success</p>
                  <p className="text-base font-black text-accent-emerald tabular-nums">{successLabel}</p>
                </div>
              </div>

              <div className="p-8 flex-1 space-y-6 relative z-10">
                <div className="flex items-center gap-2 text-landing-muted">
                  <MessageSquare size={14} />
                  <span className="text-[10px] font-black tracking-tight">Capabilities</span>
                </div>
                <div className="space-y-4">
                  {ui.feed.map((line, idx) => (
                    <div key={idx} className="flex gap-4 text-xs leading-relaxed group/line">
                      <span className="text-landing-muted shrink-0 font-mono font-bold">{idx + 1}.</span>
                      <p className="text-landing-secondary group-hover/line:text-landing-primary transition-colors font-medium">
                        {line}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-landing-divider bg-landing-surface mt-auto flex flex-col gap-3">
                <button
                  onClick={() => navigate('/dashboard/runs')}
                  className="w-full h-11 rounded-2xl border border-landing-divider bg-landing-surface flex items-center justify-between px-5 text-xs font-black text-landing-muted hover:text-landing-primary hover:border-landing-divider transition-all group/btn"
                >
                  View History
                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate(`/dashboard/agents/${agent.id}`)}
                  className={cn(
                    'w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-xs font-black transition-all',
                    `bg-accent-${ui.color}/10 text-accent-${ui.color} hover:bg-accent-${ui.color} hover:text-landing-primary shadow-lg shadow-black/20`
                  )}
                >
                  <TerminalIcon size={16} />
                  Launch Console
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
