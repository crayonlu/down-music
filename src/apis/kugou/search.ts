import type { SearchRes } from '@/types/internal/song'
import type { KuGouSearchType } from '@/types/apis/search'
import { apiClient } from '@/apis/base'
import { KuGouSearchResultSchema, normalizeKuGouSong } from '@/apis/kugou/adapter'

async function search(
  keywords: string,
  page: number,
  pagesize: number,
  type: KuGouSearchType,
): Promise<SearchRes> {
  const response = await apiClient('kugou').get('/search', {
    params: {
      keywords,
      page,
      pagesize,
      type,
    },
  })
  const raw = response.data?.data
  const parsed = KuGouSearchResultSchema.safeParse(raw)
  if (!parsed.success) {
    console.warn('Unexpected KuGou search response', parsed.error)
    return { songs: [], total: 0 }
  }

  const songs = parsed.data.lists.map(normalizeKuGouSong)
  const total = parsed.data.total ?? songs.length

  return { songs, total }
}

export { search }
