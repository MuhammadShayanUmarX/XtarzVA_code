export type EventName =
  | 'research_run_created'
  | 'research_run_completed'
  | 'research_run_failed'
  | 'agent_message_sent'

export interface EventRecord {
  name: EventName
  at: string
  props?: Record<string, unknown>
}

const KEY = 'xtarzva_events_v1'

export function trackEvent(name: EventName, props?: Record<string, unknown>) {
  try {
    const raw = localStorage.getItem(KEY)
    const events: EventRecord[] = raw ? JSON.parse(raw) : []
    events.push({ name, at: new Date().toISOString(), props })
    localStorage.setItem(KEY, JSON.stringify(events.slice(-500)))
  } catch {
    // ignore analytics failures
  }
}

