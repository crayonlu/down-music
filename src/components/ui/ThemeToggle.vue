<script lang="ts" setup>
  import { useTheme } from '@/composables/useTheme'
  import { Moon, Sun } from 'lucide-vue-next'

  const { theme, toggleTheme } = useTheme()
</script>
<template>
  <button
    class="theme-toggle"
    @click="toggleTheme"
    :title="theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'"
  >
    <Sun v-if="theme === 'dark'" :size="20" />
    <Moon v-else :size="20" />
  </button>
</template>
<style scoped lang="scss">
  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: var(--bg-secondary);
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  @media (max-width: 768px) {
    .theme-toggle {
      width: 36px;
      height: 36px;

      svg {
        width: 18px;
        height: 18px;
      }
    }
  }

  @media (max-width: 480px) {
    .theme-toggle {
      width: 32px;
      height: 32px;

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
</style>
