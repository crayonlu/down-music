import { apiClient } from '../base'

interface Artist {
  id: number
  name: string
  picUrl?: string
}

interface Album {
  id: number
  name: string
  artist: Artist
  publishTime?: number
}

interface NetEaseSong {
  id: number
  name: string
  artists: Artist[]
  album: Album
  duration: number
}

interface SearchResult {
  songs: NetEaseSong[]
  artists: Artist[]
  albums: Album[]
}

async function searchSuggest(keywords: string): Promise<SearchResult> {
  const response = await apiClient('netease').get('/search/suggest', {
    params: {
      keywords,
    },
  })
  return response.data.result
}

export { searchSuggest }
export type { NetEaseSong, Artist, Album, SearchResult }
