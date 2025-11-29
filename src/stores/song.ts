import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Platform } from '@/types/platform'
import { Song } from '@/types/internal/song'
import type { SongData } from '@/types/internal/song'

/**
 * 歌曲管理类 - 封装歌曲相关的业务逻辑
 * @author crayon
 * @date 2025-11-30
 */
class SongManager {
  private _platform: Platform
  private _currentSong: Song | null

  constructor(platform: Platform = 'netease') {
    this._platform = platform
    this._currentSong = null
  }

  /**
   * 获取当前平台
   */
  get platform(): Platform {
    return this._platform
  }

  /**
   * 设置平台
   */
  setPlatform(platform: Platform): void {
    this._platform = platform
  }

  /**
   * 获取当前歌曲
   */
  get currentSong(): Song | null {
    return this._currentSong
  }

  /**
   * 设置当前歌曲
   */
  setCurrentSong(songData: SongData | null): void {
    this._currentSong = songData ? new Song(songData) : null
  }

  /**
   * 设置当前歌曲实例
   */
  setCurrentSongInstance(song: Song | null): void {
    this._currentSong = song
  }

  /**
   * 检查是否有当前歌曲
   */
  get hasCurrentSong(): boolean {
    return this._currentSong !== null
  }

  /**
   * 获取当前歌曲的显示信息
   */
  get currentSongInfo() {
    if (!this._currentSong) {
      return {
        title: '未选择歌曲',
        artist: '',
        album: '',
        duration: '00:00',
        coverUrl: undefined,
      }
    }

    return {
      title: this._currentSong.name,
      artist: this._currentSong.artistsString,
      album: this._currentSong.album.name,
      duration: this._currentSong.formattedDuration,
      coverUrl: this._currentSong.coverUrl,
    }
  }

  /**
   * 清除当前歌曲
   */
  clearCurrentSong(): void {
    this._currentSong = null
  }
}

/**
 * 需要对歌曲进行统一处理
 * @author crayon
 * @date 2025-11-30
 */
export const useSongStore = defineStore('song', () => {
  const songManager = new SongManager('netease')

  // 当前使用的平台
  const platform = ref<Platform>(songManager.platform)

  // 当前播放的歌曲
  const currentSong = ref<Song | null>(songManager.currentSong)

  // 获取当前歌曲信息
  const currentSongInfo = computed(() => songManager.currentSongInfo)

  // 是否有当前歌曲
  const hasCurrentSong = computed(() => songManager.hasCurrentSong)

  /**
   * 设置平台
   */
  function setPlatform(newPlatform: Platform): void {
    songManager.setPlatform(newPlatform)
    platform.value = newPlatform
  }

  /**
   * 设置当前歌曲
   */
  function setCurrentSong(songData: SongData | null): void {
    songManager.setCurrentSong(songData)
    currentSong.value = songManager.currentSong
  }

  /**
   * 设置当前歌曲实例
   */
  function setCurrentSongInstance(song: Song | null): void {
    songManager.setCurrentSongInstance(song)
    currentSong.value = song
  }

  /**
   * 清除当前歌曲
   */
  function clearCurrentSong(): void {
    songManager.clearCurrentSong()
    currentSong.value = null
  }

  return {
    platform,
    currentSong,
    currentSongInfo,
    hasCurrentSong,

    setPlatform,
    setCurrentSong,
    setCurrentSongInstance,

    clearCurrentSong,
  }
})

export { SongManager }
