import { getSongURL as getKugouSongURL } from '@/apis/kugou/getSongURL'
import { getSongURL as getNeteaseSongURL } from '@/apis/netease/getSongURL'
import type { SongData } from '@/types/internal/song'

export function useSongUrl() {
  const MEDIA_PROXY_URL = (import.meta.env.VITE_MEDIA_PROXY_URL as string) || ''
  const MEDIA_PROXY_PREFIX = (import.meta.env.VITE_MEDIA_PROXY_PREFIX as string) || ''
  const getSongUrl = async (song: SongData): Promise<string> => {
    switch (song.platform) {
      case 'netease': {
        const data = await getNeteaseSongURL(Number(song.id), 0)
        const raw = data[0] ? data[0].url || '' : ''
        return wrapWithProxyIfNeeded(raw)
      }
      case 'kugou': {
        const qualities = await getKugouSongURL(song.id as string)
        if (qualities.length > 0) {
          const bestQuality = qualities[0]
          if (bestQuality) {
            const raw = bestQuality.info.tracker_url?.[0] ?? ''
            return wrapWithProxyIfNeeded(raw)
          }
        }
        throw new Error('未找到可用的播放链接')
      }
      default:
        throw new Error('不支持的平台')
    }
  }

  function wrapWithProxyIfNeeded(rawUrl: string) {
    if (!rawUrl) return ''
    const lower = rawUrl.toLowerCase()
    // Do not wrap local, blob, or already proxied urls
    if (lower.startsWith('blob:') || lower.startsWith('/') || lower.includes('/proxy?url='))
      return rawUrl
    if (lower.startsWith('http://') || lower.startsWith('https://')) {
      try {
        const parsed = new URL(rawUrl)
        const current = window.location
        if (parsed.origin === current.origin) return rawUrl
      } catch (error) {
        console.debug('wrapWithProxyIfNeeded: invalid url', error)
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
    return rawUrl
  }

  return {
    getSongUrl,
  }
}
