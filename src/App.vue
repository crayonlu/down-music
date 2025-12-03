<script setup lang="ts">
  import MusicPlayer from '@/components/player/MusicPlayer.vue'
  import ThemeToggle from '@/components/ui/ThemeToggle.vue'
  import { usePlayer } from '@/composables/usePlayer'
  import { useTheme } from '@/composables/useTheme'
  import { onMounted, ref, watch } from 'vue'

  const { currentSong, updateCurrentTime, updateDuration, turnToNextSong, isPlaying, volume } =
    usePlayer()
  const { initTheme } = useTheme()

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

  onMounted(() => {
    initTheme()
    if (audioRef.value) audioRef.value.volume = volume.value / 100
  })
</script>

<template>
  <main class="all">
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
