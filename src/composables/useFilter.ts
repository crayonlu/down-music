import { useFilterStore } from '@/stores/filter'
import type { NetEaseSearchType, KuGouSearchType } from '@/types/apis/search'
import type { Platform } from '@/types/platform'
import { search as NetEaseSearch } from '@/apis/netease/search'
import { search as KugouSearch } from '@/apis/kugou/search'
import { searchSuggest as NetEaseSearchSuggest } from '@/apis/netease/searchSuggest'
import { searchSuggest as KugouSearchSuggest } from '@/apis/kugou/searchSuggest'
import type { SearchRes, SongData } from '@/types/internal/song'
import { useDebounceFn } from '@vueuse/core'
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

  const setPlatform = (platform: Platform) => {
    filterStore.platform = platform
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

  const searchMusic: () => Promise<SearchRes> = async () => {
    switch (filterStore.platform) {
      case 'netease':
        const neteaseRes = await NetEaseSearch(
          filterStore.keywords,
          filterStore.limit,
          filterStore.offset,
          filterStore.type as NetEaseSearchType,
        )
        return {
          songs: neteaseRes.songs.map(song => ({
            platform: 'netease',
            id: song.id,
            name: song.name,
            artists: song.ar.map(artist => ({
              id: artist.id,
              name: artist.name,
            })),
            album: {
              id: song.al.id,
              name: song.al.name,
              picUrl: song.al.picUrl,
            },
            duration: song.dt,
            songUrl: '',
          })),
          total: neteaseRes.songCount,
        }
      case 'kugou':
        const kugouRes = await KugouSearch(
          filterStore.keywords,
          filterStore.currentPage,
          filterStore.limit,
          filterStore.type as KuGouSearchType,
        )
        return {
          songs: kugouRes.list.map(song => ({
            platform: 'kugou',
            id: song.FileHash,
            name: song.OriSongName,
            artists: song.Singer.map(artist => ({
              id: artist.id,
              name: artist.name,
            })),
            album: {
              id: song.AlbumID,
              name: song.AlbumName,
              picUrl: song.Image,
            },
            // 这里返回的是秒 不知道为什么
            duration: song.Duration * 1000,
            songUrl: '',
          })),
          total: kugouRes.total,
        }
      default:
        return {
          songs: [],
          total: 0,
        }
    }
  }

  const getSearchSuggest: () => Promise<SongData[] | string[]> = async () => {
    switch (filterStore.platform) {
      case 'netease':
        const neteaseSuggest = await NetEaseSearchSuggest(filterStore.keywords)
        return neteaseSuggest.songs.map(song => ({
          platform: 'netease' as Platform,
          id: song.id,
          name: song.name,
          artists: song.artists.map(artist => ({
            id: artist.id,
            name: artist.name,
          })),
          album: {
            id: song.album.id,
            name: song.album.name,
          },
          duration: song.duration,
          songUrl: '',
        }))
      case 'kugou':
        const kugouSuggest = await KugouSearchSuggest(filterStore.keywords)
        return kugouSuggest[0]?.RecordDatas.map(record => record.HintInfo) || []
      default:
        return []
    }
  }

  const debouncedGetSuggest = useDebounceFn(getSearchSuggest, 300)

  return {
    platform: filterStore.platform,
    setPlatform,
    keywords: filterStore.keywords,
    setKeywords,
    type: filterStore.type,
    setType,
    currentPage: filterStore.currentPage,
    setPage,
    increasePage,
    decreasePage,
    searchMusic,
    getSearchSuggest: debouncedGetSuggest,
  }
}
