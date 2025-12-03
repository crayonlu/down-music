import { apiClient } from '../base'

interface SongURLData {
  id: number
  url: string
  br: number
  size: number
  md5: string
  code: number
  type: string
  level: string
  time: number
}

async function getSongURL(id: number, fee: number): Promise<SongURLData[]> {
  const level = fee ? 'exhigh' : 'hires'
  const response = await apiClient('netease').get('/song/url/v1', {
    params: {
      id,
      level,
    },
  })
  return response.data.data
}

export { getSongURL }
export type { SongURLData }
