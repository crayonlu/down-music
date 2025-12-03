import type { PlayMode } from '@/types/audio'
import type { SongData } from '@/types/internal/song'
import { defineStore } from 'pinia'
import { ref } from 'vue'
/**
 * 音乐控制状态统一管理
 * @author crayon
 * @date 2025-12-01
 */
export const usePlayerStore = defineStore(
  'player',
  () => {
    const playlist = ref<SongData[]>([])
    const currentIndex = ref(-1)
    const isPlaying = ref(false)

    const currentTime = ref(0)
    const duration = ref(0)
    const volume = ref(66)
    const playMode = ref<PlayMode>('sequence')

    return {
      playlist,
      currentIndex,
      isPlaying,
      currentTime,
      duration,
      volume,
      playMode,
    }
  },
  {
    persist: {
      storage: localStorage,
      pick: ['playlist', 'currentIndex', 'volume', 'playMode', 'currentTime'],
    },
  },
)
