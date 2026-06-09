import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

export const server = setupServer(
  http.post('http://localhost:8000/api/v1/auth/register', async () => {
    return HttpResponse.json({ id: 1, email: 'test@example.com', is_active: true }, { status: 201 })
  }),
  http.post('http://localhost:8000/api/v1/auth/login', async () => {
    return HttpResponse.json(
      { access_token: 'test-access', refresh_token: 'test-refresh', token_type: 'bearer' },
      { status: 200 }
    )
  }),
  http.post('http://localhost:8000/api/v1/research-runs', async () => {
    return HttpResponse.json({ run_id: 123, status: 'queued' }, { status: 202 })
  }),
  http.get('http://localhost:8000/api/v1/research-runs', async () => {
    return HttpResponse.json(
      { items: [{ run_id: 123, status: 'completed', progress: 1, created_at: new Date().toISOString() }], total: 1, limit: 5, offset: 0 },
      { status: 200 }
    )
  }),
  http.get('http://localhost:8000/api/v1/research-runs/123', async () => {
    return HttpResponse.json(
      {
        run_id: 123,
        status: 'completed',
        progress: 1,
        report: '# Report\\n\\nHello',
        result: { scoring_version: 'v1', opportunities: [] },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { status: 200 }
    )
  }),
  http.get('http://localhost:8000/api/v1/research-runs/123/steps', async () => {
    return HttpResponse.json(
      { run_id: 123, steps: [{ id: 1, step_name: 'intent', status: 'completed' }] },
      { status: 200 }
    )
  }),
  http.get('http://localhost:8000/api/v1/user/usage', async () => {
    return HttpResponse.json({ plan: 'free', run_count_this_month: 0 }, { status: 200 })
  }),
  http.get('http://localhost:8000/api/v1/analytics/overview', async ({ request }) => {
    const url = new URL(request.url)
    const days = Math.min(366, Math.max(1, parseInt(url.searchParams.get('days') || '30', 10) || 30))
    const daily = []
    const today = new Date()
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setUTCDate(d.getUTCDate() - i)
      daily.push({ date: d.toISOString().slice(0, 10), count: i === days - 1 ? 1 : 0 })
    }
    return HttpResponse.json(
      {
        days,
        period_start: new Date(today.getTime() - days * 86400000).toISOString(),
        period_end: today.toISOString(),
        total_runs: 1,
        completed: 1,
        failed: 0,
        in_progress: 0,
        success_rate: 100,
        previous_period_total_runs: 0,
        daily,
        by_status: [{ status: 'completed', count: 1 }],
        avg_duration_seconds: 120,
        step_failures: [],
      },
      { status: 200 }
    )
  })
)

