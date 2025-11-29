import { apiClient } from '../base'

interface SearchRes {
  songs: Song[]
  songCount: number
}

interface Song {
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
  type: number,
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

export { search, type Song }
