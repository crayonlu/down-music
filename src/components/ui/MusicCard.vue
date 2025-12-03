<script lang="ts" setup>
  import { usePlayer } from '@/composables/usePlayer'
  import type { SongData } from '@/types/internal/song'
  import dayjs from 'dayjs'
  import { Download, Pause, Play, Plus } from 'lucide-vue-next'
  import { computed } from 'vue'

  const props = defineProps<{
    song: SongData
    index?: number
  }>()

  const emit = defineEmits<{
    download: [song: SongData]
    addToPlaylist: [song: SongData]
  }>()

  const { currentSong, isPlaying, playlist, currentIndex } = usePlayer()

  const isCurrentSong = computed(() => {
    return (
      currentSong.value?.id === props.song.id && currentSong.value?.platform === props.song.platform
    )
  })

  const formattedDuration = computed(() => {
    return dayjs
      .unix(props.song.duration / 1000)
      .format(props.song.duration >= 3600000 ? 'HH:mm:ss' : 'mm:ss')
  })

  const handlePlay = () => {
    if (isCurrentSong.value) {
      isPlaying.value = !isPlaying.value
    } else {
      const songIndex = playlist.value.findIndex(
        s => s.id === props.song.id && s.platform === props.song.platform,
      )
      if (songIndex !== -1) {
        currentIndex.value = songIndex
        isPlaying.value = true
      } else {
        playlist.value.push(props.song)
        currentIndex.value = playlist.value.length - 1
        isPlaying.value = true
      }
    }
  }

  const handleDownload = () => {
    emit('download', props.song)
  }

  const handleAddToPlaylist = () => {
    const exists = playlist.value.some(
      s => s.id === props.song.id && s.platform === props.song.platform,
    )
    if (!exists) {
      playlist.value.push(props.song)
    }
    emit('addToPlaylist', props.song)
  }
</script>
<template>
  <div class="music-card" :class="{ 'is-playing': isCurrentSong }">
    <div v-if="index !== undefined" class="index">{{ index + 1 }}</div>

    <div class="cover-wrapper">
      <img v-if="song.album?.picUrl" :src="song.album.picUrl" :alt="song.name" class="cover" />
      <div class="cover-overlay">
        <button class="play-btn" @click="handlePlay">
          <Pause v-if="isCurrentSong && isPlaying" :size="20" />
          <Play v-else :size="20" />
        </button>
      </div>
    </div>

    <div class="info">
      <div class="name">{{ song.name }}</div>
      <div class="artist">{{ song.artists.map(a => a.name).join(' / ') }}</div>
    </div>

    <div class="album">{{ song.album?.name || '-' }}</div>

    <div class="duration">{{ formattedDuration }}</div>

    <div class="actions">
      <button class="action-btn" title="添加到播放列表" @click="handleAddToPlaylist">
        <Plus :size="18" />
      </button>
      <button class="action-btn" title="下载" @click="handleDownload">
        <Download :size="18" />
      </button>
    </div>
  </div>
</template>
<style scoped lang="scss">
  .music-card {
    display: grid;
    grid-template-columns: 40px 60px 1fr 1fr 80px 100px;
    gap: 16px;
    align-items: center;
    padding: 12px 16px;
    background: var(--bg-elevated);
    border-radius: 8px;
    transition: all 0.2s;
    position: relative;

    &:hover {
      background: var(--bg-secondary);
      box-shadow: var(--shadow-sm);

      .cover-overlay {
        opacity: 1;
      }

      .actions {
        opacity: 1;
      }
    }

    &.is-playing {
      background: var(--state-active);

      .name {
        color: var(--accent-primary);
      }
    }

    .index {
      font-size: 14px;
      color: var(--text-secondary);
      text-align: center;
      font-weight: 500;
    }

    .cover-wrapper {
      position: relative;
      width: 50px;
      height: 50px;
      border-radius: 6px;
      overflow: hidden;

      .cover {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .cover-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s;

        .play-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: var(--accent-primary);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: var(--accent-hover);
            transform: scale(1.1);
          }

          &:active {
            transform: scale(0.95);
          }
        }
      }
    }

    .info {
      min-width: 0;

      .name {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: 4px;
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

    .album {
      font-size: 13px;
      color: var(--text-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .duration {
      font-size: 13px;
      color: var(--text-secondary);
      text-align: center;
    }

    .actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      opacity: 0;
      transition: opacity 0.2s;

      .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: transparent;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: var(--bg-primary);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        &:active {
          transform: scale(0.95);
        }
      }
    }
  }

  @media (max-width: 768px) {
    .music-card {
      grid-template-columns: 50px 1fr 80px;
      gap: 12px;

      .index,
      .album {
        display: none;
      }

      .actions {
        opacity: 1;
      }
    }
  }
</style>
