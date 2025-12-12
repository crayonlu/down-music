import { search as KugouSearch } from '@/apis/kugou/search'
import { searchSuggest as KugouSearchSuggest } from '@/apis/kugou/searchSuggest'
import { search as NetEaseSearch } from '@/apis/netease/search'
import { searchSuggest as NetEaseSearchSuggest } from '@/apis/netease/searchSuggest'
import { useFilterStore } from '@/stores/filter'
import type { KuGouSearchType, NetEaseSearchType } from '@/types/apis/search'
import type { SearchRes, SongData } from '@/types/internal/song'
import { useDebounceFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'
/**
 * Filter的组合式函数
 * 类似于React的Hook
 * @author crayon
 * @date 2025-11-29
 * @returns anything you need
 */
export function useFilter() {
  const filterStore = useFilterStore()
  const {
    platform,
    keywords,
    type,
    currentPage,
    limit,
    offset,
    searchResults,
    total,
    hasSearched,
  } = storeToRefs(filterStore)

  const increasePage = () => {
    currentPage.value += 1
  }

  const decreasePage = () => {
    if (currentPage.value > 1) {
      currentPage.value -= 1
    }
  }

  const syncTypeWithPlatform = () => {
    if (platform.value === 'netease' && typeof type.value === 'string') {
      type.value = 1 as NetEaseSearchType
    } else if (platform.value === 'kugou' && typeof type.value === 'number') {
      type.value = 'song' as KuGouSearchType
    }
  }

  const searchMusic: () => Promise<SearchRes> = async () => {
    let result: SearchRes = { songs: [], total: 0 }
    switch (platform.value) {
      case 'netease':
        result = await NetEaseSearch(
          keywords.value,
          limit.value,
          offset.value,
          type.value as NetEaseSearchType,
        )
        break
      case 'kugou':
        result = await KugouSearch(
          keywords.value,
          currentPage.value,
          limit.value,
          type.value as KuGouSearchType,
        )
        break
      default:
        result = {
          songs: [],
          total: 0,
        }
    }
    searchResults.value = result.songs
    total.value = result.total
    hasSearched.value = true
    return result
  }

  const getSearchSuggest: () => Promise<SongData[] | string[]> = async () => {
    switch (platform.value) {
      case 'netease':
        const neteaseSuggest = await NetEaseSearchSuggest(keywords.value)
        return neteaseSuggest

      case 'kugou':
        const kugouSuggest = await KugouSearchSuggest(keywords.value)
        return kugouSuggest[0]?.RecordDatas.map(record => record.HintInfo) || []
      default:
        return []
    }
  }

  const debouncedGetSuggest = useDebounceFn(getSearchSuggest, 300)

  return {
    platform,
    keywords,
    type,
    currentPage,
    limit,
    offset,
    increasePage,
    decreasePage,
    searchMusic,
    getSearchSuggest: debouncedGetSuggest,
    searchResults,
    total,
    hasSearched,
    syncTypeWithPlatform,
  }
}
