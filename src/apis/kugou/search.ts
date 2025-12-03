import type { KuGouSearchType } from '../../types/apis/search'
import { apiClient } from '../base'

interface SearchRes {
  total: number
  lists: Array<{
    Image: string
    AlbumID: string
    AlbumName: string
    FileHash: string
    Res: {
      FileSize: number
      TimeLength: number
    }
    Singers: Array<{
      id: number
      name: string
    }>
    Duration: number
    OriSongName: string
  }>
}

async function search(
  keywords: string,
  page: number,
  pagesize: number,
  type: KuGouSearchType,
): Promise<SearchRes> {
  const response = await apiClient('kugou').get('/search', {
    params: {
      keyword: keywords,
      page,
      pagesize,
      type,
    },
  })
  return response.data.data
}

export { search }
export type { SearchRes }
