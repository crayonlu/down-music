import { useSongStore } from '@/stores/song'
import type { Platform } from '@/types/platform'
import type { SongData } from '@/types/internal/song'
import { Song } from '@/types/internal/song'

/**
 * Song的组合式函数 - 负责操作逻辑
 * 类似于React的Hook
 * @author crayon
 * @date 2025-12-01
 * @returns anything you need
 */
export function useSong() {
  const songStore = useSongStore()

  // 设置平台
  const setPlatform = (platform: Platform) => {
    songStore.platform = platform
  }

  // 设置当前歌曲
  const setCurrentSong = (songData: SongData | null) => {
    songStore.currentSong = songData ? new Song(songData) : null
  }

  // 设置当前歌曲实例
  const setCurrentSongInstance = (song: Song | null) => {
    songStore.currentSong = song
  }

  // 清除当前歌曲
  const clearCurrentSong = () => {
    songStore.currentSong = null
  }

  // 获取当前歌曲实例
  const getCurrentSongInstance = (): Song | null => {
    return songStore.currentSong
  }

  return {
    platform: songStore.platform,
    currentSong: songStore.currentSong,
    currentSongInfo: songStore.currentSongInfo,
    hasCurrentSong: songStore.hasCurrentSong,

    setPlatform,
    setCurrentSong,
    setCurrentSongInstance,
    clearCurrentSong,
    getCurrentSongInstance,
  }
}
