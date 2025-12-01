import { usePlayerStore } from '@/stores/player'
import { PLAY_MODES, type PlayMode } from '@/types/audio'
import dayjs from 'dayjs'
import { computed } from 'vue'

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
  const currentSong = computed(() => {
    if (playerStore.currentIndex === -1 || playerStore.currentIndex >= playerStore.playlist.length)
      return null
    return playerStore.playlist[playerStore.currentIndex]
  })

  const togglePlay = () => {
    playerStore.isPlaying = !playerStore.isPlaying
  }

  const turnToNextSong = () => {
    if (playerStore.playlist.length === 0) return
    switch (playerStore.playMode) {
      case 'loop':
        playerStore.currentIndex = (playerStore.currentIndex + 1) % playerStore.playlist.length
        break
      case 'random':
        playerStore.currentIndex = Math.floor(Math.random() * playerStore.playlist.length)
        break
      case 'sequence':
      default:
        if (playerStore.currentIndex < playerStore.playlist.length - 1) {
          playerStore.currentIndex++
        } else {
          // 如果是顺序播放且已经到达最后一首歌，则回到第一首
          playerStore.currentIndex = 0
        }
        break
    }
  }

  const turnToPrevSong = () => {
    if (playerStore.playlist.length === 0) return
    switch (playerStore.playMode) {
      case 'loop':
        playerStore.currentIndex =
          (playerStore.currentIndex - 1 + playerStore.playlist.length) % playerStore.playlist.length
        break
      case 'random':
        playerStore.currentIndex = Math.floor(Math.random() * playerStore.playlist.length)
        break
      case 'sequence':
      default:
        if (playerStore.currentIndex > 0) {
          playerStore.currentIndex--
        } else {
          // 如果是顺序播放且已经到达第一首歌，则跳到最后一首
          playerStore.currentIndex = playerStore.playlist.length - 1
        }
        break
    }
  }

  const turnToSpecificSong = (index: number) => {
    if (index < 0 || index >= playerStore.playlist.length) return
    playerStore.currentIndex = index
  }

  // 更新当前播放时间
  const updateCurrentTime = (time: number) => {
    playerStore.currentTime = time
  }

  // 更新歌曲总时长
  const updateDuration = (duration: number) => {
    playerStore.duration = duration
  }

  // 设置音量
  const setVolume = (volume: number) => {
    playerStore.volume = Math.max(0, Math.min(100, volume))
  }

  // 跳转到指定时间（秒）
  const seekTo = (time: number) => {
    playerStore.currentTime = time * 1000
  }

  // 切换播放模式
  const togglePlayMode = () => {
    const modes: PlayMode[] = PLAY_MODES
    const currentModeIndex = modes.indexOf(playerStore.playMode)
    const nextMode = modes[(currentModeIndex + 1) % modes.length]
    if (nextMode) playerStore.playMode = nextMode
  }

  // 获取当前播放歌曲
  const getCurrentSong = () => {
    if (playerStore.currentIndex >= 0 && playerStore.currentIndex < playerStore.playlist.length) {
      return playerStore.playlist[playerStore.currentIndex]
    }
    return null
  }

  return {
    playerStore,
    togglePlay,
    turnToNextSong,
    turnToPrevSong,
    turnToSpecificSong,
    updateCurrentTime,
    updateDuration,
    setVolume,
    seekTo,
    togglePlayMode,
    getCurrentSong,

    playlist: playerStore.playlist,
    currentIndex: playerStore.currentIndex,
    currentSong,
    isPlaying: playerStore.isPlaying,
    currentTime: playerStore.currentTime,
    // 格式化后的当前播放时间，格式为 mm:ss 或 HH:mm:ss
    formattedCurrentTime: dayjs
      .unix(playerStore.currentTime / 1000)
      .format(playerStore.duration >= 3600000 ? 'HH:mm:ss' : 'mm:ss'),
    duration: playerStore.duration,
    volume: playerStore.volume,
    playMode: playerStore.playMode,
  }
}
