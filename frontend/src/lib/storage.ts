/**
 * Secure storage utilities
 * Provides a centralized way to manage localStorage with error handling
 */

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const

/**
 * Safely get item from localStorage
 */
export function getStorageItem(key: string): string | null {
  try {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(key)
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`)
    return null
  }
}

/**
 * Safely set item in localStorage
 */
export function setStorageItem(key: string, value: string): boolean {
  try {
    if (typeof window === 'undefined') return false
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.error(`Error writing to localStorage: ${error}`)
    return false
  }
}

/**
 * Safely remove item from localStorage
 */
export function removeStorageItem(key: string): boolean {
  try {
    if (typeof window === 'undefined') return false
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`)
    return false
  }
}

/**
 * Token management utilities
 */
export const tokenStorage = {
  getAccessToken: () => getStorageItem(TOKEN_KEYS.ACCESS_TOKEN),
  getRefreshToken: () => getStorageItem(TOKEN_KEYS.REFRESH_TOKEN),
  setAccessToken: (token: string) => setStorageItem(TOKEN_KEYS.ACCESS_TOKEN, token),
  setRefreshToken: (token: string) => setStorageItem(TOKEN_KEYS.REFRESH_TOKEN, token),
  removeAccessToken: () => removeStorageItem(TOKEN_KEYS.ACCESS_TOKEN),
  removeRefreshToken: () => removeStorageItem(TOKEN_KEYS.REFRESH_TOKEN),
  clearTokens: () => {
    removeStorageItem(TOKEN_KEYS.ACCESS_TOKEN)
    removeStorageItem(TOKEN_KEYS.REFRESH_TOKEN)
  },
}

