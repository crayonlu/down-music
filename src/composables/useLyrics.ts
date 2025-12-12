import type { Platform } from '@/types/platform'
import type { ParsedLyrics } from '@/utils/lyricsParser'
import { getLyrics as getKugouLytics } from '@/apis/kugou/getLyrics'
import { getLyrics as getNeteaseLyrics } from '@/apis/netease/getLyrics'
import { parseLyrics } from '@/utils/lyricsParser'
export function useLyrics() {
  const getLyrics = async (id: string | number, platform: Platform): Promise<ParsedLyrics> => {
    switch (platform) {
      case 'netease': {
        const res = await getNeteaseLyrics(id as number)
        return parseLyrics(res)
      }
      case 'kugou': {
        const res = await getKugouLytics(id as string)
        return parseLyrics(res)
      }
    }
  }
  return {
    getLyrics,
  }
}
