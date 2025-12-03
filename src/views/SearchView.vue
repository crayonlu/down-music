<script lang="ts" setup>
  import MusicCard from '@/components/ui/MusicCard.vue'
  import SearchBar from '@/components/ui/SearchBar.vue'
  import { useDownload } from '@/composables/useDownload'
  import { useFilter } from '@/composables/useFilter'
  import type { SongData } from '@/types/internal/song'
  import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-vue-next'
  import { ref } from 'vue'

  const { currentPage, increasePage, decreasePage, searchMusic } = useFilter()
  const { downloadSong } = useDownload()
  const searchResults = ref<SongData[]>([])
  const total = ref(0)
  const loading = ref(false)
  const hasSearched = ref(false)
  const downloading = ref(false)

  const handleSearch = async () => {
    loading.value = true
    hasSearched.value = true
    try {
      const result = await searchMusic()
      searchResults.value = result.songs
      total.value = result.total
    } catch (error) {
      console.error('搜索失败:', error)
    } finally {
      loading.value = false
    }
  }

  const handlePrevPage = async () => {
    decreasePage()
    await handleSearch()
  }

  const handleNextPage = async () => {
    increasePage()
    await handleSearch()
  }

  const handleDownload = async (song: SongData) => {
    if (downloading.value) {
      console.log('已有歌曲正在下载，请稍后...')
      return
    }

    try {
      downloading.value = true
      await downloadSong(song)
      console.log('下载完成:', song.name)
    } catch (error) {
      console.error('下载失败:', error)
      alert(`下载失败: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      downloading.value = false
    }
  }

  const handleAddToPlaylist = (song: SongData) => {
    console.log('添加到播放列表:', song)
  }
</script>
<template>
  <div class="search-view">
    <SearchBar @search="handleSearch" />

    <div v-if="loading" class="loading">
      <Loader2 class="spinner" :size="32" />
      <p>搜索中...</p>
    </div>

    <div v-else-if="!hasSearched" class="empty-state">
      <p>请输入关键词开始搜索</p>
    </div>

    <div v-else-if="searchResults.length === 0" class="empty-state">
      <p>没有找到相关结果</p>
    </div>

    <div v-else class="results-container">
      <div class="results-header">
        <h2>搜索结果</h2>
        <span class="total">共 {{ total }} 首</span>
      </div>

      <div class="table-header">
        <div class="col-index">#</div>
        <div class="col-cover"></div>
        <div class="col-info">歌曲</div>
        <div class="col-album">专辑</div>
        <div class="col-duration">时长</div>
        <div class="col-actions">操作</div>
      </div>

      <div class="results-list">
        <MusicCard
          v-for="(song, index) in searchResults"
          :key="`${song.platform}-${song.id}`"
          :song="song"
          :index="index"
          @download="handleDownload"
          @add-to-playlist="handleAddToPlaylist"
        />
      </div>

      <div class="pagination">
        <button class="page-btn" :disabled="currentPage === 1" @click="handlePrevPage">
          <ChevronLeft :size="18" />
          上一页
        </button>
        <span class="page-info">第 {{ currentPage }} 页</span>
        <button class="page-btn" :disabled="searchResults.length === 0" @click="handleNextPage">
          下一页
          <ChevronRight :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .search-view {
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      color: var(--text-secondary);

      .spinner {
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
        color: var(--accent-primary);
      }

      p {
        font-size: 14px;
      }
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      color: var(--text-secondary);
      font-size: 14px;
    }

    .results-container {
      margin-top: 24px;

      .results-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;

        h2 {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .total {
          font-size: 14px;
          color: var(--text-secondary);
        }
      }

      .table-header {
        display: grid;
        grid-template-columns: 40px 60px 1fr 1fr 80px 100px;
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

      .results-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 8px;
      }

      .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin-top: 32px;
        padding: 20px 0;

        .page-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;

          &:hover:not(:disabled) {
            background: var(--bg-secondary);
            border-color: var(--accent-primary);
            color: var(--accent-primary);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          &:active:not(:disabled) {
            transform: scale(0.98);
          }
        }

        .page-info {
          font-size: 14px;
          color: var(--text-secondary);
          min-width: 80px;
          text-align: center;
        }
      }
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .search-view {
      padding: 16px;

      .results-container {
        .table-header {
          grid-template-columns: 50px 1fr 80px;

          .col-index,
          .col-album {
            display: none;
          }
        }
      }
    }
  }
</style>
