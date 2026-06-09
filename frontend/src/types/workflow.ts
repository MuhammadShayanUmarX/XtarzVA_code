import { LucideIcon } from 'lucide-react'

export interface AgentReport {
  stats: {
    label: string
    value: string
  }[]
  details: string
}

export interface AgentStep {
  id: string
  name: string
  icon: LucideIcon
  color: string
  description: string
  report?: AgentReport
  locked?: boolean
  lockedText?: string
}

export type WorkflowPhase = 'running' | 'reporting'
