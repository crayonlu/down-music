import { apiClient } from '@/apis/base'
import { KuGouSuggestResultSchema } from '@/apis/kugou/adapter'

interface SuggestRecord {
  HintInfo: string
  Hot?: number
}

interface SuggestCategory {
  RecordDatas: SuggestRecord[]
  RecordCount?: number
  LableName?: string
}

async function searchSuggest(keywords: string): Promise<SuggestCategory[]> {
  const response = await apiClient('kugou').get('/search/suggest', {
    params: {
      keywords,
    },
  })
  const raw = response.data?.data
  const parsed = KuGouSuggestResultSchema.safeParse(raw)
  if (!parsed.success) {
    console.warn('Unexpected KuGou searchSuggest response', parsed.error)
    return []
  }
  return parsed.data as SuggestCategory[]
}

export { searchSuggest }
export type { SuggestCategory, SuggestRecord }
