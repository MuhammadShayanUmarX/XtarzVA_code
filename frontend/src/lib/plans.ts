const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter',
  growth: 'Growth',
  agency: 'Agency',
}

const PLAN_PRICES: Record<string, number> = {
  starter: 49,
  growth: 99,
  agency: 299,
}

export function getPlanLabel(plan: string): string {
  return PLAN_LABELS[plan] || plan.charAt(0).toUpperCase() + plan.slice(1)
}

export function getPlanPrice(plan: string): number {
  return PLAN_PRICES[plan] ?? 0
}

export function getInitials(name: string, email: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return (email.split('@')[0] || 'U').substring(0, 2).toUpperCase()
}
