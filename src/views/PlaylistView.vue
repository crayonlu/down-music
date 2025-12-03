<script lang="ts" setup>
  import MusicCard from '@/components/ui/MusicCard.vue'
  import { useDownload } from '@/composables/useDownload'
  import { usePlayer } from '@/composables/usePlayer'
  import type { SongData } from '@/types/internal/song'
  import { ListMusic, Trash2 } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  const { playlist, currentIndex, currentSong } = usePlayer()
  const { downloadSong } = useDownload()

  const handleRemove = (index: number) => {
    if (index < currentIndex.value) {
      currentIndex.value--
    } else if (index === currentIndex.value) {
      if (playlist.value.length === 1) {
        currentIndex.value = -1
      }
    }
    playlist.value.splice(index, 1)
  }

  const handleClearAll = () => {
    playlist.value = []
    currentIndex.value = -1
  }

  const handleDownload = async (song: SongData) => {
    try {
      toast.loading('下载中...', { id: 'download' })
      await downloadSong(song)
      toast.success('下载完成', { id: 'download' })
    } catch (error) {
      toast.error('下载失败', {
        id: 'download',
        description: error instanceof Error ? error.message : '未知错误',
      })
    }
  }
</script>
<template>
  <div class="playlist-view">
    <div class="header">
      <div class="title">
        <ListMusic :size="24" />
        <h1>播放列表</h1>
        <span class="count">{{ playlist.length }} 首</span>
      </div>
      <button v-if="playlist.length > 0" class="clear-btn" @click="handleClearAll">
        <Trash2 :size="16" />
        清空列表
      </button>
    </div>

    <div v-if="playlist.length === 0" class="empty-state">
      <ListMusic :size="48" class="empty-icon" />
      <p>播放列表为空</p>
      <span>去搜索页面添加歌曲吧</span>
    </div>

    <div v-else class="playlist-container">
      <div class="table-header">
        <div class="col-index">#</div>
        <div class="col-cover"></div>
        <div class="col-info">歌曲</div>
        <div class="col-album">专辑</div>
        <div class="col-duration">时长</div>
        <div class="col-actions">操作</div>
      </div>

      <div class="playlist-list">
        <div
          v-for="(song, index) in playlist"
          :key="`${song.platform}-${song.id}`"
          class="playlist-item"
          :class="{
            'is-current': currentSong?.id === song.id && currentSong?.platform === song.platform,
          }"
        >
          <MusicCard
            :song="song"
            :index="index"
            :show-remove="true"
            @download="handleDownload"
            @remove="handleRemove(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .playlist-view {
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
    padding-bottom: 120px;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;

      .title {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--text-primary);

        h1 {
          font-size: 24px;
          font-weight: 600;
        }

        .count {
          font-size: 14px;
          color: var(--text-secondary);
          background: var(--bg-secondary);
          padding: 4px 12px;
          border-radius: 12px;
        }
      }

      .clear-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: transparent;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-secondary);
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #fee2e2;
          border-color: #ef4444;
          color: #ef4444;
        }
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      color: var(--text-secondary);

      .empty-icon {
        margin-bottom: 16px;
        opacity: 0.5;
      }

      p {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 8px;
      }

      span {
        font-size: 14px;
        color: var(--text-tertiary);
      }
    }

    .playlist-container {
      .table-header {
        display: grid;
        grid-template-columns: 40px 60px 1fr 1fr 80px 140px;
        gap: 16px;
        padding: 12px 16px;
        font-size: 12px;
        font-weight: 500;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 1px solid var(--border-color);

        .col-index {
          text-align: center;
        }

        .col-duration {
          text-align: center;
        }

        .col-actions {
          text-align: right;
        }
      }

      .playlist-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 8px;

        .playlist-item {
          :deep(.music-card) {
            grid-template-columns: 40px 60px 1fr 1fr 80px 140px;
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    .playlist-view {
      padding: 16px;

      .playlist-container {
        .table-header {
          grid-template-columns: 50px 1fr 80px;

          .col-index,
          .col-album {
            display: none;
          }
        }

        .playlist-list .playlist-item {
          :deep(.music-card) {
            grid-template-columns: 50px 1fr 120px;
          }
        }
      }
    }
  }
</style>
