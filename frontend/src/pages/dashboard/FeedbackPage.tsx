import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Loader2, CheckCircle2, Star, ChevronRight } from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { cn } from '../../lib/utils'
import { getApiErrorMessage } from '../../lib/apiErrors'

const CATEGORIES = [
  'General feedback',
  'Bug report',
  'Feature request',
  'UI / UX',
  'Agent quality',
  'Billing',
] as const

interface FeedbackItem {
  id: string
  category: string
  rating: number | null
  message: string
  page_context: string | null
  created_at: string
}

export default function FeedbackPage() {
  const [category, setCategory] = useState<string>(CATEGORIES[0])
  const [rating, setRating] = useState<number>(0)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [history, setHistory] = useState<FeedbackItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    api.get('/v2/support/feedback')
      .then((res) => setHistory(res.data))
      .catch(() => setHistory([]))
      .finally(() => setLoadingHistory(false))
  }, [isSuccess])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsSubmitting(true)
    try {
      await api.post('/v2/support/feedback', {
        category,
        message: message.trim(),
        rating: rating > 0 ? rating : undefined,
        page_context: 'dashboard',
      })
      setIsSuccess(true)
      setMessage('')
      setRating(0)
      toast.success('Thank you — your feedback was saved.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not submit feedback.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-[900px] mx-auto space-y-12 pb-32">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-landing-accentLime/10 border border-landing-accentLime/20 flex items-center justify-center text-landing-accentLime">
            <MessageSquare size={24} />
          </div>
          <h1 className="text-4xl font-black text-landing-primary tracking-tight">Feedback</h1>
        </div>
        <p className="text-lg text-landing-secondary font-medium max-w-2xl">
          Tell us what is working, what is not, or what you would like to see next. Every submission is stored and reviewed.
        </p>
      </header>

      {isSuccess && (
        <div className="p-5 rounded-2xl bg-landing-accentLime/10 border border-landing-accentLime/20 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-landing-accentLime shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-black text-white">Feedback received</p>
            <p className="text-xs text-landing-secondary mt-1">We appreciate you taking the time to help us improve XtarzVA.</p>
          </div>
        </div>
      )}

      <section className="glass-panel p-8 md:p-10 rounded-[32px] border-landing-divider">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-landing-muted tracking-tight">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-12 bg-landing-bg border border-landing-divider focus:border-landing-accent/50 rounded-xl px-4 text-sm text-white focus:outline-none"
              disabled={isSubmitting}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-landing-muted tracking-tight">Rating (optional)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n === rating ? 0 : n)}
                  className={cn(
                    'w-10 h-10 rounded-xl border flex items-center justify-center transition-all',
                    rating >= n
                      ? 'border-landing-accent bg-landing-accent/15 text-landing-accent'
                      : 'border-landing-divider text-landing-muted hover:border-landing-accent/30'
                  )}
                >
                  <Star size={16} fill={rating >= n ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-landing-muted tracking-tight">Your feedback *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your experience, bug, or idea..."
              rows={6}
              required
              disabled={isSubmitting}
              className="w-full bg-landing-bg border border-landing-divider focus:border-landing-accent/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-landing-muted focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!message.trim() || isSubmitting}
            className="w-full h-14 btn-proper-primary justify-center text-base disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit feedback
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-black text-white">Your past feedback</h2>
        {loadingHistory ? (
          <div className="flex items-center gap-2 text-landing-muted text-sm">
            <Loader2 size={16} className="animate-spin" />
            Loading...
          </div>
        ) : history.length === 0 ? (
          <p className="text-sm text-landing-muted">No feedback submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="glass-panel p-5 rounded-2xl border-landing-divider">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs font-black text-landing-accent">{item.category}</span>
                  <span className="text-[10px] text-landing-muted">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                {item.rating && (
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} size={12} className="text-landing-accent" fill="currentColor" />
                    ))}
                  </div>
                )}
                <p className="text-sm text-landing-secondary">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="text-sm text-landing-muted text-center">
        Looking for guides? Visit the{' '}
        <Link to="/dashboard/help" className="text-landing-accent font-medium hover:text-landing-accentSoft">
          Help Center
        </Link>
      </p>
    </div>
  )
}
