<script lang="ts" setup>
  import DefaultCover from '@/assets/images/default-cover.jpg'
  import AudioVisualizer from '@/components/player/AudioVisualizer.vue'
  import { useLyrics } from '@/composables/useLyrics'
  import { usePlayer } from '@/composables/usePlayer'
  import { getCurrentLyricIndex } from '@/utils/lyricsParser'
  import { useElementSize } from '@vueuse/core'
  import { computed, nextTick, onMounted, ref, watch } from 'vue'

  const { currentSong, currentTime, seekTo, isPlaying } = usePlayer()
  const { getLyrics } = useLyrics()

  const lyricsContainerRef = ref<HTMLElement>()
  const coverRef = ref<HTMLElement>()
  const { width: coverWidth } = useElementSize(coverRef)
  const coverRadius = computed(() => coverWidth.value / 2)

  const currentLyricIndex = ref(-1)
  const userScrolling = ref(false)
  const scrollTimeout = ref<number>()

  watch(
    currentSong,
    async newSong => {
      if (newSong && !newSong.lyrics) {
        const lyrics = await getLyrics(newSong.id, newSong.platform)
        newSong.lyrics = lyrics
        currentLyricIndex.value = -1
        userScrolling.value = false
      }
    },
    { immediate: true },
  )

  const cover = computed(
    () => currentSong.value?.picUrl || currentSong.value?.album?.picUrl || DefaultCover,
  )

  const lyrics = computed(() => currentSong.value?.lyrics)

  watch(currentTime, newTime => {
    if (!lyrics.value || userScrolling.value) return

    const newIndex = getCurrentLyricIndex(lyrics.value, newTime)
    if (newIndex !== currentLyricIndex.value) {
      currentLyricIndex.value = newIndex
      scrollToLyric(newIndex)
    }
  })

  const scrollToLyric = async (index: number) => {
    if (index < 0 || !lyricsContainerRef.value) return

    await nextTick()
    const lyricElement = lyricsContainerRef.value.querySelector(`[data-index="${index}"]`)
    if (lyricElement) {
      lyricElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleLyricClick = (time: number) => {
    seekTo(time / 1000)
    isPlaying.value = true
    userScrolling.value = false
  }

  const handleScroll = () => {
    userScrolling.value = true

    if (scrollTimeout.value) {
      clearTimeout(scrollTimeout.value)
    }
    scrollTimeout.value = window.setTimeout(() => {
      userScrolling.value = false
    }, 3000)
  }

  onMounted(() => {
    if (lyrics.value) {
      currentLyricIndex.value = getCurrentLyricIndex(lyrics.value, currentTime.value)
      scrollToLyric(currentLyricIndex.value)
    }
  })
</script>
<template>
  <div class="lyrics-view">
    <div class="cover-ctn">
      <AudioVisualizer :radius="coverRadius" />
      <img ref="coverRef" :src="cover" :alt="currentSong?.name || '封面'" class="cover" />
    </div>
    <div class="lyrics-ctn" ref="lyricsContainerRef" @scroll="handleScroll">
      <div v-if="lyrics && lyrics.lines.length > 0" class="lyrics-list">
        <div
          v-for="(line, index) in lyrics.lines"
          :key="index"
          :data-index="index"
          class="lyric-line"
          :class="{ active: index === currentLyricIndex }"
          @click="handleLyricClick(line.time)"
        >
          {{ line.text || '...' }}
        </div>
      </div>
      <div v-else class="no-lyrics">
        <p>暂无歌词</p>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  .lyrics-view {
    height: calc(100dvh - 80px);
    width: 100dvw;
    display: flex;

    .cover-ctn {
      flex: 2;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      .cover {
        width: 70%;
        max-width: 600px;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 50%;
        animation: rotate 20s linear infinite;
        animation-play-state: running;
        position: relative;
        z-index: 1;
      }
    }

    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .lyrics-ctn {
      flex: 3;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      overflow-y: auto;
      scroll-behavior: smooth;
      padding: 40px 0;

      .lyrics-list {
        width: 100%;
        max-width: 800px;
        padding: 0 20px;

        .lyric-line {
          padding: 12px 16px;
          margin: 4px 0;
          font-size: 18px;
          line-height: 1.6;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 8px;
          user-select: none;
          display: flex;
          justify-content: center;

          &:hover {
            color: var(--text-primary);
            background-color: var(--bg-secondary);
            transform: translateX(4px);
          }

          &.active {
            color: var(--primary);
            font-size: 22px;
            font-weight: 600;
            transform: scale(1.05);
          }
        }
      }

      .no-lyrics {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        color: var(--text-secondary);
        font-size: 18px;
      }
    }
  }
</style>
