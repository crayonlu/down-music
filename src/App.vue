<script setup lang="ts">
  import { usePlayer } from '@/composables/usePlayer'
  import { computed, onMounted, ref, watch } from 'vue'

  const { getCurrentSong, updateCurrentTime, updateDuration, turnToNextSong, isPlaying, volume } =
    usePlayer()

  const audioRef = ref<HTMLAudioElement>()

  const currentSong = computed(() => getCurrentSong())

  watch(currentSong, newSong => {
    if (audioRef.value && newSong) {
      audioRef.value.src = newSong.songUrl
      if (isPlaying) audioRef.value.play()
    }
  })

  watch(
    () => isPlaying,
    playing => {
      if (audioRef.value) {
        if (playing) {
          audioRef.value.play()
        } else {
          audioRef.value.pause()
        }
      }
    },
  )

  watch(
    () => volume,
    vol => {
      if (audioRef.value) audioRef.value.volume = vol / 100
    },
  )

  onMounted(() => {
    if (audioRef.value) audioRef.value.volume = volume / 100
  })
</script>

<template>
  <main class="all">
    <audio
      ref="audioRef"
      @timeupdate="audioRef && updateCurrentTime(audioRef.currentTime * 1000)"
      @loadedmetadata="audioRef && updateDuration(audioRef.duration * 1000)"
      @ended="turnToNextSong"
      @error="console.error('音频加载失败')"
    />
  </main>
</template>

<style scoped></style>
