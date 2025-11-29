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

interface Song {
  id: number
  name: string
  artists: Artist[]
  album: Album
  duration: number
}

interface SearchResult {
  songs: Song[]
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
export type { Song, Artist, Album, SearchResult }
