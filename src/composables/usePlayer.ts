import { usePlayerStore } from '@/stores/player'
import { PLAY_MODES, type PlayMode } from '@/types/audio'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { formatTime } from '@/utils/time'
/**
 * Player的组合式函数
 * 对于音频的操作均封装在这里
 * 数据流通方式 data -> store -> composable -> component
 * @author crayon
 * @date 2025-12-01
 * @returns anything you need
 */
export function usePlayer() {
  const playerStore = usePlayerStore()
  const { playlist, currentIndex, isPlaying, currentTime, duration, volume, playMode } =
    storeToRefs(playerStore)

  const currentSong = computed(() => {
    if (currentIndex.value === -1 || currentIndex.value >= playlist.value.length) return null
    return playlist.value[currentIndex.value]
  })

  const togglePlay = () => {
    isPlaying.value = !isPlaying.value
  }

  const turnToNextSong = () => {
    if (playlist.value.length === 0) return
    switch (playMode.value) {
      case 'loop':
        currentIndex.value = (currentIndex.value + 1) % playlist.value.length
        break
      case 'random':
        currentIndex.value = Math.floor(Math.random() * playlist.value.length)
        break
      case 'sequence':
      default:
        if (currentIndex.value < playlist.value.length - 1) {
          currentIndex.value++
        } else {
          // 如果是顺序播放且已经到达最后一首歌，则回到第一首
          currentIndex.value = 0
        }
        break
    }
  }

  const turnToPrevSong = () => {
    if (playlist.value.length === 0) return
    switch (playMode.value) {
      case 'loop':
        currentIndex.value =
          (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
        break
      case 'random':
        currentIndex.value = Math.floor(Math.random() * playlist.value.length)
        break
      case 'sequence':
      default:
        if (currentIndex.value > 0) {
          currentIndex.value--
        } else {
          // 如果是顺序播放且已经到达第一首歌，则跳到最后一首
          currentIndex.value = playlist.value.length - 1
        }
        break
    }
  }

  const turnToSpecificSong = (index: number) => {
    if (index < 0 || index >= playlist.value.length) return
    currentIndex.value = index
  }

  // 更新当前播放时间
  const updateCurrentTime = (time: number) => {
    currentTime.value = time
  }

  // 更新歌曲总时长
  const updateDuration = (time: number) => {
    duration.value = time
  }

  // 跳转到指定时间（秒）
  const seekTo = (seconds: number) => {
    currentTime.value = seconds * 1000
  }

  // 切换播放模式
  const togglePlayMode = () => {
    const modes: PlayMode[] = PLAY_MODES
    const currentModeIndex = modes.indexOf(playMode.value)
    const nextMode = modes[(currentModeIndex + 1) % modes.length]
    if (nextMode) playMode.value = nextMode
  }

  // 格式化时间
  const formattedCurrentTime = computed(() =>
    formatTime(currentTime.value),
  )

  const formattedDuration = computed(() =>
    formatTime(duration.value),
  )

  return {
    playlist,
    currentIndex,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    playMode,
    formattedCurrentTime,
    formattedDuration,

    togglePlay,
    turnToNextSong,
    turnToPrevSong,
    turnToSpecificSong,
    updateCurrentTime,
    updateDuration,
    seekTo,
    togglePlayMode,
  }
}
