import { apiClient } from '@/apis/base'
import { NetEaseSearchResultSchema, normalizeNetEaseSong } from '@/apis/netease/adapter'
import type { NetEaseSearchType } from '@/types/apis/search'
import type { SearchRes } from '@/types/internal/song'

async function search(
  keywords: string,
  limit: number,
  offset: number,
  type: NetEaseSearchType,
): Promise<SearchRes> {
  const response = await apiClient('netease').get('/cloudsearch', {
    params: {
      keywords,
      limit,
      offset,
      type,
    },
  })

  const rawResult = response.data?.result ?? response.data?.data ?? response.data
  if (!rawResult) {
    console.warn('Empty NetEase search response', response.data)
    return { songs: [], total: 0 }
  }
  const parsed = NetEaseSearchResultSchema.safeParse(rawResult)
  if (!parsed.success) {
    console.warn('Unexpected NetEase search response', parsed.error)
    return { songs: [], total: 0 }
  }

  const songs = parsed.data.songs.map(normalizeNetEaseSong)
  const total = parsed.data.songCount ?? parsed.data.songs.length

  return { songs, total }
}

export { search }
