import { apiClient } from '@/apis/base'
import { NetEaseSongUrlListSchema } from '@/apis/netease/adapter'

interface SongURLData {
  id: number
  url: string
  br: number
  size: number
  md5: string
  code: number
  type?: string
  level?: string
  time?: number
}

async function getSongURL(id: number, fee: number): Promise<SongURLData[]> {
  const level = fee ? 'exhigh' : 'hires'
  const response = await apiClient('netease').get('/song/url/v1', {
    params: {
      id,
      level,
    },
  })
  const raw = response.data?.data
  const parsed = NetEaseSongUrlListSchema.safeParse(raw)
  if (!parsed.success) {
    console.warn('Unexpected NetEase song URL response', parsed.error)
    return []
  }
  return parsed.data
}

export { getSongURL }
export type { SongURLData }
