<script lang="ts" setup>
  import CustomBtn from '@/components/ui/CustomBtn.vue'
  import CustomSelect from '@/components/ui/CustomSelect.vue'
  import { useFilter } from '@/composables/useFilter'
  import { useMediaProxy } from '@/composables/useMediaProxy'
  import type { SongData } from '@/types/internal/song'
  import { getPlatformIcon, platformOptions } from '@/utils/platformIconMap'
  import { autoUpdate, flip, offset, shift, size, useFloating } from '@floating-ui/vue'
  import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

  const emit = defineEmits<{
    search: []
  }>()

  const { platform, keywords, getSearchSuggest, syncTypeWithPlatform } = useFilter()
  const searchSuggest = ref<SongData[] | string[]>([])
  const showSuggest = ref(false)
  const inputRef = ref<HTMLInputElement>()
  const suggestRef = ref<HTMLElement>()

  watch(platform, () => {
    syncTypeWithPlatform()
  })

  const { floatingStyles } = useFloating(inputRef, suggestRef, {
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip(),
      shift(),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          })
        },
      }),
    ],
  })

  const { wrap } = useMediaProxy()

  const handleGetSuggest = async () => {
    if (keywords.value.trim()) {
      searchSuggest.value = await getSearchSuggest()
      showSuggest.value = searchSuggest.value.length > 0
    } else {
      showSuggest.value = false
    }
  }

  const selectSuggest = (suggest: SongData | string) => {
    if (typeof suggest === 'string') {
      keywords.value = suggest
    } else {
      keywords.value = suggest.name
    }
    showSuggest.value = false
    emit('search')
  }

  const handleSearch = () => {
    showSuggest.value = false
    emit('search')
  }

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (
      inputRef.value &&
      suggestRef.value &&
      !inputRef.value.contains(target) &&
      !suggestRef.value.contains(target)
    ) {
      showSuggest.value = false
    }
  }

  onMounted(() => document.addEventListener('click', handleClickOutside))
  onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>
<template>
  <div class="search-bar">
    <CustomSelect v-model="platform" :options="platformOptions" class="platform-select">
      <template #trigger="{ modelValue }">
        <component :is="getPlatformIcon(modelValue)" class="platform-icon" />
        <span class="option-content">
          {{ platformOptions.find(option => option.value === modelValue)?.label }}
        </span>
      </template>
      <template #option="{ option }">
        <component :is="getPlatformIcon(option.value)" class="platform-icon" />
        <span class="option-content">{{ option.label }}</span>
      </template>
    </CustomSelect>
    <div class="search-input-wrapper">
      <input
        ref="inputRef"
        v-model="keywords"
        type="text"
        class="search-input"
        placeholder="搜索音乐、歌手、专辑..."
        @input="handleGetSuggest"
        @keyup.enter="handleSearch"
        @focus="keywords.trim() && handleGetSuggest()"
      />
      <teleport to="body">
        <div v-if="showSuggest" ref="suggestRef" class="search-suggest" :style="floatingStyles">
          <div
            v-for="(suggest, index) in searchSuggest"
            :key="index"
            class="suggest-item"
            @click="selectSuggest(suggest)"
          >
            <template v-if="typeof suggest === 'string'">
              {{ suggest }}
            </template>
            <template v-else>
              <div class="suggest-song">
                <img
                  v-if="suggest.picUrl"
                  :src="wrap(suggest.picUrl)"
                  alt=""
                  class="suggest-cover"
                />
                <div class="suggest-info">
                  <div class="suggest-name">{{ suggest.name }}</div>
                  <div class="suggest-artist">
                    {{ suggest.artists.map(a => a.name).join(' ') }}
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </teleport>
    </div>
    <CustomBtn type="primary" @click="handleSearch">搜索</CustomBtn>
  </div>
</template>

<style scoped lang="scss">
  .search-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: var(--bg-elevated);
    border-radius: 8px;
    box-shadow: var(--shadow-sm);

    .platform-select {
      flex: 0 0 140px;
    }

    .search-input-wrapper {
      flex: 1;
      position: relative;
    }

    .search-input {
      width: 100%;
      height: 36px;
      padding: 0 12px;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      color: var(--text-primary);
      font-size: 14px;
      outline: none;
      transition: all 0.2s;

      &::placeholder {
        color: var(--text-tertiary);
      }

      &:focus {
        border-color: var(--accent-primary);
        background: var(--bg-elevated);
        box-shadow: var(--shadow-sm);
      }

      &:hover {
        border-color: var(--accent-primary);
      }
    }

    .option-content {
      display: flex;
      align-items: center;
      gap: 8px;

      .platform-icon {
        width: 16px;
        height: 16px;
        color: var(--text-secondary);
      }
    }
  }

  .search-suggest {
    background: var(--bg-elevated);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    box-shadow: var(--shadow-md);
    overflow: hidden;
    max-height: 400px;
    overflow-y: auto;
    z-index: 1001;

    .suggest-item {
      padding: 10px 12px;
      cursor: pointer;
      transition: all 0.15s;
      color: var(--text-primary);
      font-size: 14px;

      &:hover {
        background: var(--bg-secondary);
      }

      &:not(:last-child) {
        border-bottom: 1px solid var(--border-color);
      }

      .suggest-song {
        display: flex;
        align-items: center;
        gap: 10px;

        .suggest-cover {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .suggest-info {
          flex: 1;
          min-width: 0;

          .suggest-name {
            font-weight: 500;
            color: var(--text-primary);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 4px;
          }

          .suggest-artist {
            font-size: 12px;
            color: var(--text-secondary);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    .search-bar {
      gap: 10px;
      padding: 12px;

      .platform-select {
        flex: 0 0 70px;
        .option-content {
          display: none;
        }
      }

      .search-input-wrapper {
        width: 100%;
      }
    }
  }

  @media (max-width: 480px) {
    .search-bar {
      padding: 10px;
      gap: 8px;

      .search-input {
        height: 34px;
        font-size: 13px;
      }
    }

    .search-suggest {
      max-height: 300px;

      .suggest-item {
        padding: 8px 10px;
        font-size: 13px;

        .suggest-song {
          .suggest-cover {
            width: 35px;
            height: 35px;
          }

          .suggest-info {
            .suggest-name {
              font-size: 13px;
            }

            .suggest-artist {
              font-size: 11px;
            }
          }
        }
      }
    }
  }
</style>
