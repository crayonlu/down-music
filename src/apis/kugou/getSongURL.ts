import { apiClient } from '@/apis/base'
import { KuGouSongQualityListSchema } from '@/apis/kugou/adapter'

interface SongInfo {
  filesize?: number
  extname?: string
  bitrate?: number
  duration?: number
  tracker_url?: string[]
}

interface SongQuality {
  hash: string
  info: SongInfo
  quality?: string
}

async function getSongURL(fileHash: string): Promise<SongQuality[]> {
  const response = await apiClient('kugou').get('/song/url/new', {
    params: {
      hash: fileHash,
    },
  })
  const raw = response.data?.data
  const parsed = KuGouSongQualityListSchema.safeParse(raw)
  if (!parsed.success) {
    console.warn('Unexpected KuGou song URL response', parsed.error)
    return []
  }
  return parsed.data
}

export { getSongURL }
export type { SongInfo, SongQuality }
