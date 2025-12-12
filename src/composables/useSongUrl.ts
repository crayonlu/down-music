import { getSongURL as getKugouSongURL } from '@/apis/kugou/getSongURL'
import { getSongURL as getNeteaseSongURL } from '@/apis/netease/getSongURL'
import type { SongData } from '@/types/internal/song'

export function useSongUrl() {
  const getSongUrl = async (song: SongData): Promise<string> => {
    switch (song.platform) {
      case 'netease': {
        const data = await getNeteaseSongURL(Number(song.id), 0)
        return data[0] ? data[0].url : ''
      }
      case 'kugou': {
        const qualities = await getKugouSongURL(song.id as string)
        if (qualities.length > 0) {
          const bestQuality = qualities[0]
          if (bestQuality) {
            return bestQuality.info.tracker_url?.[0] ?? ''
          }
        }
        throw new Error('未找到可用的播放链接')
      }
      default:
        throw new Error('不支持的平台')
    }
  }

  return {
    getSongUrl,
  }
}
