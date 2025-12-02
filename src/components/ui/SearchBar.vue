<script lang="ts" setup>
  import CustomBtn from '@/components/ui/CustomBtn.vue'
  import CustomSelect from '@/components/ui/CustomSelect.vue'
  import { useFilter } from '@/composables/useFilter'
  import { getPlatformIcon, platformOptions } from '@/utils/platformIconMap'
  const { keywords, platform, searchMusic, getSearchSuggest } = useFilter()
</script>
<template>
  <div class="search-bar">
    <CustomSelect v-model="platform" :options="platformOptions" class="platform-select">
      <template #option="{ option }">
        <span class="option-content">
          <component :is="getPlatformIcon(option.value)" class="platform-icon" />
          {{ option.label }}
        </span>
      </template>
    </CustomSelect>
    <input
      v-model="keywords"
      type="text"
      class="search-input"
      placeholder="搜索音乐、歌手、专辑..."
      @input="getSearchSuggest"
      @keyup.enter="searchMusic"
    />
    <CustomBtn type="primary" @click="searchMusic">搜索</CustomBtn>
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

    .search-input {
      flex: 1;
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
</style>
