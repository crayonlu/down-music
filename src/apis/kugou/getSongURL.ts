import { apiClient } from '../base'

interface SongInfo {
  filesize: number
  extname: string
  bitrate: number
  duration: number
  tracker_url: string[]
}

interface SongQuality {
  hash: string
  info: SongInfo
  quality: string
}

async function getSongURL(fileHash: string): Promise<SongQuality[]> {
  const response = await apiClient('kugou').get('/song/url/new', {
    params: {
      hash: fileHash,
    },
  })
  return response.data.data
}

export { getSongURL }
export type { SongQuality, SongInfo }
