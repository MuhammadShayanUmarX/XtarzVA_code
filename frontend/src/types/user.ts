export interface CurrentUser {
  id: string
  email: string
  name: string
  plan: string
  is_onboarded: boolean
  avatar_url?: string | null
}

export interface BillingInfo {
  plan: string
  plan_label: string
  plan_price: number
  plan_credits: number
  bonus_credits: number
  used_credits: number
  remaining_credits: number
  reset_at: string
}

export interface UserPreferences {
  default_niches?: string[] | null
  default_sources?: string[] | null
  default_budget: number
  default_margin_target: number
  default_risk: string
  kill_criteria_enabled: boolean
  notification_prefs: Record<string, boolean>
}

export interface AgentStat {
  id: string
  name: string
  role: string
  goal: string
  tasks: number
  completed: number
  failed: number
  success_rate: number | null
  status: 'idle' | 'running' | 'done'
}
