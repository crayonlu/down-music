import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Platform } from '@/types/platform'
import { Song } from '@/types/internal/song'

/**
 * 歌曲状态管理
 * @author crayon
 * @date 2025-12-01
 */
export const useSongStore = defineStore('song', () => {
  // 当前使用的平台
  const platform = ref<Platform>('netease')

  // 当前播放的歌曲实例
  const currentSong = ref<Song | null>(null)

  // 获取当前歌曲信息
  const currentSongInfo = computed(() => {
    if (!currentSong.value) {
      return {
        title: '未选择歌曲',
        artist: '',
        album: '',
        duration: '00:00',
        coverUrl: undefined,
      }
    }

    return {
      title: currentSong.value.name,
      artist: currentSong.value.artistsString,
      album: currentSong.value.album.name,
      duration: currentSong.value.formattedDuration,
      coverUrl: currentSong.value.coverUrl,
    }
  })

  // 是否有当前歌曲
  const hasCurrentSong = computed(() => currentSong.value !== null)

  return {
    platform,
    currentSong,
    currentSongInfo,
    hasCurrentSong,
  }
})
