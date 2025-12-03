import { search as KugouSearch } from '@/apis/kugou/search'
import { searchSuggest as KugouSearchSuggest } from '@/apis/kugou/searchSuggest'
import { search as NetEaseSearch } from '@/apis/netease/search'
import { searchSuggest as NetEaseSearchSuggest } from '@/apis/netease/searchSuggest'
import { useFilterStore } from '@/stores/filter'
import type { KuGouSearchType, NetEaseSearchType } from '@/types/apis/search'
import type { SearchRes, SongData } from '@/types/internal/song'
import type { Platform } from '@/types/platform'
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
  const { platform, keywords, type, currentPage, limit, offset } = storeToRefs(filterStore)

  const increasePage = () => {
    currentPage.value += 1
  }

  const decreasePage = () => {
    if (currentPage.value > 1) {
      currentPage.value -= 1
    }
  }

  const searchMusic: () => Promise<SearchRes> = async () => {
    switch (platform.value) {
      case 'netease':
        const neteaseRes = await NetEaseSearch(
          keywords.value,
          limit.value,
          offset.value,
          type.value as NetEaseSearchType,
        )
        return {
          songs: neteaseRes.songs.map(song => ({
            platform: 'netease',
            id: song.id,
            name: song.name,
            picUrl: song.al.picUrl,
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
          keywords.value,
          currentPage.value,
          limit.value,
          type.value as KuGouSearchType,
        )
        return {
          songs: kugouRes.lists.map(song => ({
            platform: 'kugou',
            id: song.FileHash,
            name: song.OriSongName,
            picUrl: song.Image,
            artists: song.Singers.map(artist => ({
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
    switch (platform.value) {
      case 'netease':
        const neteaseSuggest = await NetEaseSearchSuggest(keywords.value)
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
  }
}
