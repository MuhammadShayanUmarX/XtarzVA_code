import { useCallback, useEffect, useState } from 'react'
import api from '../lib/api'
import { useSession } from '../store/session'
import type { CurrentUser } from '../types/user'

interface UseCurrentUserResult {
  user: CurrentUser | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  updateUser: (patch: Partial<Pick<CurrentUser, 'name' | 'avatar_url'>>) => Promise<CurrentUser>
}

export function useCurrentUser(): UseCurrentUserResult {
  const { accessToken } = useSession()
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(Boolean(accessToken))
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!accessToken) {
      setUser(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await api.get<CurrentUser>('/v2/auth/me')
      setUser(res.data)
    } catch (err: unknown) {
      setUser(null)
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(typeof msg === 'string' ? msg : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    refresh()
  }, [refresh])

  const updateUser = useCallback(async (patch: Partial<Pick<CurrentUser, 'name' | 'avatar_url'>>) => {
    const res = await api.patch<CurrentUser>('/v2/auth/me', patch)
    setUser(res.data)
    return res.data
  }, [])

  return { user, loading, error, refresh, updateUser }
}
