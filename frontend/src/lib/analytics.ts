/**
 * Analytics derived from API-backed research runs.
 * All data comes from /api/v1/research-runs — no localStorage dependency.
 */

export interface UsageTrend {
  date: string
  count: number
}

export interface AnalyticsData {
  totalRuns: number
  completedRuns: number
  failedRuns: number
  successRate: number
  dailyUsage: UsageTrend[]
}

export function buildAnalyticsFromRuns(
  runs: Array<{ run_id: number; status: string; progress: number; created_at: string }>
): AnalyticsData {
  const total = runs.length
  const completed = runs.filter(r => r.status === 'completed').length
  const failed = runs.filter(r => r.status === 'failed').length
  const successRate = total > 0 ? Math.round((completed / total) * 100) : 0

  const dailyCounts: Record<string, number> = {}
  runs.forEach(run => {
    const dateKey = run.created_at?.split('T')[0]
    if (dateKey) dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1
  })

  const today = new Date()
  const dailyUsage: UsageTrend[] = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split('T')[0]
    dailyUsage.push({ date: dateKey, count: dailyCounts[dateKey] || 0 })
  }

  return { totalRuns: total, completedRuns: completed, failedRuns: failed, successRate, dailyUsage }
}

export function emptyAnalytics(): AnalyticsData {
  const today = new Date()
  const dailyUsage: UsageTrend[] = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dailyUsage.push({ date: date.toISOString().split('T')[0], count: 0 })
  }
  return { totalRuns: 0, completedRuns: 0, failedRuns: 0, successRate: 0, dailyUsage }
}

/** Response shape for GET /api/v1/analytics/overview */
export type AnalyticsOverview = {
  days: number
  period_start: string
  period_end: string
  total_runs: number
  completed: number
  failed: number
  in_progress: number
  success_rate: number
  previous_period_total_runs: number
  daily: { date: string; count: number }[]
  by_status: { status: string; count: number }[]
  avg_duration_seconds: number | null
  step_failures: { step_name: string; count: number }[]
}
