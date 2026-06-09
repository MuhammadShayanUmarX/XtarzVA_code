import { create } from 'zustand'
import { tokenStorage } from '../lib/storage'

type SessionState = {
  accessToken: string | null
  setTokens: (access: string | null, refresh?: string | null) => void
  clear: () => void
}

export const useSession = create<SessionState>((set) => ({
  accessToken: tokenStorage.getAccessToken(),
  setTokens: (access, refresh) => {
    if (access) {
      tokenStorage.setAccessToken(access)
    } else {
      tokenStorage.removeAccessToken()
    }
    
    if (refresh !== undefined) {
      if (refresh) {
        tokenStorage.setRefreshToken(refresh)
      } else {
        tokenStorage.removeRefreshToken()
      }
    }
    
    set({ accessToken: access })
  },
  clear: () => {
    tokenStorage.clearTokens()
    set({ accessToken: null })
  }
}))


