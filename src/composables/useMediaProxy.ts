export function useMediaProxy() {
  const MEDIA_PROXY_URL = (import.meta.env.VITE_MEDIA_PROXY_URL as string) || ''
  const MEDIA_PROXY_PREFIX = (import.meta.env.VITE_MEDIA_PROXY_PREFIX as string) || ''
  const PROXY_IMAGES =
    ((import.meta.env.VITE_PROXY_IMAGES as string) || 'false').toLowerCase() === 'true'

  function wrap(rawUrl?: string | null) {
    if (!rawUrl) return ''
    // If image proxying is disabled, return the raw url.
    if (!PROXY_IMAGES) return rawUrl
    const lower = rawUrl.toLowerCase()
    if (lower.startsWith('blob:') || lower.startsWith('/') || lower.includes('/proxy?url='))
      return rawUrl
    try {
      const parsed = new URL(rawUrl)
      const current = window.location
      if (parsed.origin === current.origin) return rawUrl
    } catch (error) {
      console.debug('useMediaProxy.wrap: invalid url', error)
      return rawUrl
    }

    if (MEDIA_PROXY_URL) {
      const trimmed = MEDIA_PROXY_URL.replace(/\/$/, '')
      const hasProxyPath = /\/proxy(\/|$)/i.test(trimmed)
      const base = hasProxyPath ? trimmed : `${trimmed}/proxy`
      return `${base}?url=${encodeURIComponent(rawUrl)}`
    }

    const prefix = MEDIA_PROXY_PREFIX
      ? MEDIA_PROXY_PREFIX.startsWith('/')
        ? MEDIA_PROXY_PREFIX
        : `/${MEDIA_PROXY_PREFIX}`
      : ''
    return `${window.location.origin}${prefix}/proxy?url=${encodeURIComponent(rawUrl)}`
  }

  return { wrap }
}
