import { AxiosError } from 'axios'

export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!err || typeof err !== 'object') return fallback

  const axiosErr = err as AxiosError<{ detail?: string | Array<{ msg?: string }> }>

  if (!axiosErr.response) {
    if (axiosErr.code === 'ECONNABORTED') {
      return 'Request timed out. Please check your connection and try again.'
    }
    return 'Cannot connect to server. Start the XtarzVA backend (see backend/README.md).'
  }

  const detail = axiosErr.response.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg

  return fallback
}
