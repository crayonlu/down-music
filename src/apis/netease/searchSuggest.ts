import { apiClient } from '@/apis/base'
import { NetEaseSearchSuggestSchema, normalizeNetEaseSuggestSong } from '@/apis/netease/adapter'
import type { SongData } from '@/types/internal/song'

async function searchSuggest(keywords: string): Promise<SongData[]> {
  const response = await apiClient('netease').get('/search/suggest', {
    params: {
      keywords,
    },
  })
  const raw = response.data?.result ?? response.data?.data ?? response.data
  if (!raw) {
    console.warn('Empty NetEase searchSuggest response', response.data)
    return []
  }
  const parsed = NetEaseSearchSuggestSchema.safeParse(raw)
  if (!parsed.success || !parsed.data) {
    console.warn(
      'Unexpected NetEase searchSuggest response',
      parsed.success ? 'no data' : parsed.error,
    )
    return []
  }
  const parsedData = parsed.data
  return (parsedData.songs ?? []).map(normalizeNetEaseSuggestSong)
}

export { searchSuggest }
