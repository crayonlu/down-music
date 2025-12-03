<script setup lang="ts">
  import MusicPlayer from '@/components/player/MusicPlayer.vue'
  import ThemeToggle from '@/components/ui/ThemeToggle.vue'
  import { usePlayer } from '@/composables/usePlayer'
  import { useTheme } from '@/composables/useTheme'
  import { onMounted, ref, watch } from 'vue'
  import { Toaster } from 'vue-sonner'

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

  const audioRef = ref<HTMLAudioElement>()

  watch(currentSong, newSong => {
    if (audioRef.value && newSong) {
      audioRef.value.src = newSong.songUrl
      if (isPlaying.value) audioRef.value.play()
    }
  })

  watch(isPlaying, playing => {
    if (audioRef.value) {
      if (playing) audioRef.value.play()
      else audioRef.value.pause()
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
      if (currentSong.value?.songUrl) {
        audioRef.value.src = currentSong.value.songUrl
      }
    }
  })
</script>

<template>
  <main class="all">
    <Toaster position="top-center" :theme="theme" richColors />
    <ThemeToggle class="theme-toggle-btn" />
    <audio
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
    top: 16px;
    right: 16px;
    z-index: 1001;
  }
</style>
