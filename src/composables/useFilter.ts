import { useFilterStore } from '@/stores/filter'
import type { NetEaseSearchType } from '@/types/search'

/**
 * Filter的组合式函数
 * 类似于React的Hook
 * @author crayon
 * @date 2025-11-29
 * @returns anything you need
 */
export function useFilter() {
  const filterStore = useFilterStore()

  const setKeywords = (keywords: string) => {
    filterStore.keywords = keywords
  }

  const setPage = (page: number) => {
    filterStore.currentPage = page
  }

  const increasePage = () => {
    filterStore.currentPage += 1
  }

  const decreasePage = () => {
    if (filterStore.currentPage > 1) {
      filterStore.currentPage -= 1
    }
  }

  const setType = (type: NetEaseSearchType) => {
    filterStore.type = type
  }

  return {
    keywords: filterStore.keywords,
    setKeywords,
    type: filterStore.type,
    setType,
    currentPage: filterStore.currentPage,
    setPage,
    increasePage,
    decreasePage,
  }
}
