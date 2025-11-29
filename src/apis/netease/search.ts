import type { NetEaseSearchType } from '@/types/apis/search'
import { apiClient } from '../base'
interface SearchRes {
  songs: NetEaseSong[]
  songCount: number
}

interface NetEaseSong {
  id: number
  name: string
  ar: Array<{
    id: number
    name: string
  }>
  al: {
    id: number
    name: string
    picUrl: string
  }
  dt: number
  fee: number
}

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
  return response.data.result
}

export { search, type NetEaseSong }
