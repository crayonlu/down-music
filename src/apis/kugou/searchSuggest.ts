import { apiClient } from '../base'

interface SuggestRecord {
  HintInfo: string
  Hot: number
}

interface SuggestCategory {
  RecordDatas: SuggestRecord[]
  RecordCount: number
  LableName: string
}

async function searchSuggest(keywords: string): Promise<SuggestCategory[]> {
  const response = await apiClient('kugou').get('/search/suggest', {
    params: {
      keyword: keywords,
    },
  })
  return response.data.data
}

export { searchSuggest }
export type { SuggestCategory, SuggestRecord }
