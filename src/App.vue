<script setup lang="ts">
  import MusicPlayer from '@/components/player/MusicPlayer.vue'
  import ThemeToggle from '@/components/ui/ThemeToggle.vue'
  import { usePlayer } from '@/composables/usePlayer'
  import { useSongUrl } from '@/composables/useSongUrl'
  import { useTheme } from '@/composables/useTheme'
  import { onMounted, ref, watch } from 'vue'
  import { Toaster, toast } from 'vue-sonner'

  const {
    currentSong,
    updateCurrentTime,
    updateDuration,
    turnToNextSong,
    isPlaying,
    volume,
    currentTime,
    playMode,
  } = usePlayer()
  const { initTheme, theme } = useTheme()
  const { getSongUrl } = useSongUrl()

  const audioRef = ref<HTMLAudioElement>()

  const loadAndPlaySong = async (song: typeof currentSong.value, autoPlay = false) => {
    if (!song || !audioRef.value) return

    try {
      const url = await getSongUrl(song)
      if (url) {
        song.songUrl = url
        if (audioRef.value.src !== url) {
          audioRef.value.src = url
        }
        if (autoPlay || isPlaying.value) {
          if (!isPlaying.value) isPlaying.value = true
          audioRef.value.play().catch(e => {
            console.warn('播放失败:', e)
            isPlaying.value = false
          })
        }
      } else {
        toast.error('无法获取播放链接')
        isPlaying.value = false
      }
    } catch (error) {
      console.error('获取播放链接失败', error)
      toast.error('获取播放链接失败')
      isPlaying.value = false
    }
  }

  watch(currentSong, async newSong => {
    if (newSong) {
      await loadAndPlaySong(newSong, isPlaying.value)
    }
  })

  watch(isPlaying, async playing => {
    if (audioRef.value) {
      if (playing) {
        if (!audioRef.value.src && currentSong.value) {
          await loadAndPlaySong(currentSong.value, true)
        } else {
          audioRef.value.play().catch(() => (isPlaying.value = false))
        }
      } else {
        audioRef.value.pause()
      }
    }
  })

  watch(volume, vol => {
    if (audioRef.value) audioRef.value.volume = vol / 100
  })

  watch(currentTime, time => {
    if (audioRef.value && Math.abs(audioRef.value.currentTime * 1000 - time) > 1000) {
      audioRef.value.currentTime = time / 1000
    }
  })

  watch(playMode, mode => {
    if (audioRef.value) audioRef.value.loop = mode === 'loop'
  })

  onMounted(() => {
    initTheme()
    if (audioRef.value) {
      audioRef.value.volume = volume.value / 100
      audioRef.value.loop = playMode.value === 'loop'
      if (currentSong.value) {
        loadAndPlaySong(currentSong.value, false).then(() => {
          if (audioRef.value) audioRef.value.currentTime = currentTime.value / 1000
        })
      }
    }
  })
</script>

<template>
  <main class="all">
    <Toaster position="top-center" :theme="theme" richColors />
    <ThemeToggle class="theme-toggle-btn" :class="{ 'has-player': !!currentSong }" />
    <audio
      id="global-audio"
      crossorigin="anonymous"
      ref="audioRef"
      @timeupdate="audioRef && updateCurrentTime(audioRef.currentTime * 1000)"
      @loadedmetadata="audioRef && updateDuration(audioRef.duration * 1000)"
      @ended="turnToNextSong"
      @error="console.error('音频加载失败')"
    />
    <RouterView />
    <MusicPlayer />
  </main>
</template>

<style scoped>
  .theme-toggle-btn {
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 1001;
    transition: bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .theme-toggle-btn.has-player {
    bottom: 100px;
  }
</style>
