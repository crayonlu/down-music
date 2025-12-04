<script lang="ts" setup>
  import DefaultCover from '@/assets/images/default-cover.jpg'
  import LyricsModal from '@/components/player/LyricsModal.vue'
  import { usePlayer } from '@/composables/usePlayer'
  import {
    ListMusic,
    Pause,
    Play,
    Repeat,
    Repeat1,
    Shuffle,
    SkipBack,
    SkipForward,
    Volume2,
  } from 'lucide-vue-next'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const showLyrics = ref(false)

  const {
    currentSong,
    isPlaying,
    currentTime,
    formattedCurrentTime,
    duration,
    formattedDuration,
    volume,
    playMode,
    togglePlay,
    turnToNextSong,
    turnToPrevSong,
    seekTo,
    togglePlayMode,
  } = usePlayer()

  const currentTimeInSeconds = computed({
    get: () => currentTime.value / 1000,
    set: (value: number) => seekTo(value),
  })

  const playModeIcon = computed(() => {
    switch (playMode.value) {
      case 'sequence':
        return Repeat
      case 'loop':
        return Repeat1
      case 'random':
        return Shuffle
      default:
        return Repeat
    }
  })
</script>

<template>
  <div v-if="currentSong" class="music-player">
    <LyricsModal :show="showLyrics" @close="showLyrics = false" />

    <div class="song-info">
      <img
        :src="currentSong.picUrl || currentSong.album?.picUrl || DefaultCover"
        alt="封面"
        class="cover"
        @click="showLyrics = !showLyrics"
      />
      <div class="info">
        <div class="name">{{ currentSong.name }}</div>
        <div class="artist">{{ currentSong.artists.map(a => a.name).join(' ') }}</div>
      </div>
    </div>

    <div class="controls">
      <button class="btn" @click="turnToPrevSong">
        <SkipBack :size="20" />
      </button>
      <button class="btn btn-play" @click="togglePlay">
        <Play v-if="!isPlaying" :size="24" />
        <Pause v-else :size="24" />
      </button>
      <button class="btn" @click="turnToNextSong">
        <SkipForward :size="20" />
      </button>
    </div>

    <div class="progress">
      <span class="time">{{ formattedCurrentTime }}</span>
      <div class="progress-container">
        <input
          v-model="currentTimeInSeconds"
          type="range"
          :max="duration / 1000"
          class="progress-bar"
          :style="{ '--progress': `${(currentTimeInSeconds / (duration / 1000)) * 100}%` }"
        />
      </div>
      <span class="time">{{ formattedDuration }}</span>
    </div>

    <div class="features">
      <button class="btn btn-mode" @click="togglePlayMode">
        <component :is="playModeIcon" :size="18" />
      </button>
      <button
        class="btn btn-playlist"
        @click="
          router.currentRoute.value.path === '/playlist' ? router.back() : router.push('/playlist')
        "
      >
        <ListMusic :size="18" />
      </button>
      <div class="volume">
        <Volume2 :size="18" />
        <input v-model="volume" type="range" max="100" class="volume-bar" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .music-player {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: var(--bg-elevated);
    border-top: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    padding: 0 20px;
    gap: 20px;
    z-index: 1000;
    box-shadow: var(--shadow-md);

    .song-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 0 0 300px;

      .cover {
        width: 50px;
        height: 50px;
        border-radius: 4px;
        object-fit: cover;
      }

      .info {
        flex: 1;
        min-width: 0;

        .name {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .artist {
          font-size: 12px;
          color: var(--text-secondary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .controls {
      display: flex;
      gap: 10px;
      flex: 0 0 auto;
      align-items: center;

      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        border: 1px solid var(--border-color);
        background: var(--bg-elevated);
        color: var(--text-primary);
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: var(--bg-secondary);
        }

        &.btn-play {
          width: 44px;
          height: 44px;
          background: var(--accent-primary);
          color: var(--bg-elevated);
          border-color: var(--accent-primary);

          &:hover {
            background: var(--accent-hover);
            border-color: var(--accent-hover);
          }
        }
      }
    }

    .progress {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;

      .time {
        font-size: 12px;
        color: var(--text-secondary);
        min-width: 40px;
      }

      .progress-container {
        flex: 1;
        display: flex;
        align-items: center;
        position: relative;
      }

      .progress-bar {
        width: 100%;
        height: 4px;
        appearance: none;
        -webkit-appearance: none;
        background: linear-gradient(
          to right,
          var(--accent-primary) 0%,
          var(--accent-primary) var(--progress),
          var(--bg-secondary) var(--progress),
          var(--bg-secondary) 100%
        );
        border-radius: 2px;
        outline: none;
        cursor: pointer;
        transition: background 0.1s linear;

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 0;
          height: 0;
          background: transparent;
          cursor: pointer;
        }

        &::-moz-range-thumb {
          width: 0;
          height: 0;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        &:hover {
          &::-webkit-slider-thumb {
            width: 12px;
            height: 12px;
            background: var(--accent-primary);
            border-radius: 50%;
            transition: all 0.2s;
          }

          &::-moz-range-thumb {
            width: 12px;
            height: 12px;
            background: var(--accent-primary);
            border-radius: 50%;
            transition: all 0.2s;
          }
        }
      }
    }

    .features {
      display: flex;
      align-items: center;
      gap: 20px;
      flex: 0 0 auto;

      .btn-mode {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px;
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--text-secondary);
        transition: all 0.2s;

        &:hover {
          color: var(--accent-primary);
        }
      }

      .btn-playlist {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px;
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--text-secondary);
        transition: all 0.2s;

        &:hover {
          color: var(--accent-primary);
        }
      }

      .btn-lyrics {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px;
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--text-secondary);
        transition: all 0.2s;

        &:hover {
          color: var(--accent-primary);
        }
      }

      .volume {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-secondary);

        .volume-bar {
          width: 80px;
          height: 4px;
          appearance: none;
          -webkit-appearance: none;
          background: var(--bg-secondary);
          border-radius: 2px;
          outline: none;
          cursor: pointer;

          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 10px;
            height: 10px;
            background: var(--accent-primary);
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
              transform: scale(1.2);
            }
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    .music-player {
      padding: 0 12px;
      gap: 12px;
      height: 70px;

      .song-info {
        flex: 0 0 auto;
        min-width: 0;

        .cover {
          width: 45px;
          height: 45px;
        }

        .info {
          max-width: 120px;

          .name {
            font-size: 13px;
          }

          .artist {
            font-size: 11px;
          }
        }
      }

      .controls {
        gap: 8px;

        .btn {
          padding: 6px;

          &.btn-play {
            width: 38px;
            height: 38px;
          }
        }
      }

      .progress {
        flex: 1;
        min-width: 0;
        gap: 4px;
        .time {
          font-size: 11px;
        }
      }

      .features {
        gap: 12px;

        .volume {
          display: none;
        }
      }
    }
  }

  @media (max-width: 480px) {
    .music-player {
      display: flex;
      justify-content: space-between;
      .song-info {
        .info {
          max-width: 80px;
        }
      }

      .progress {
        display: none;
      }

      .controls {
        gap: 6px;
      }
    }
  }
</style>
