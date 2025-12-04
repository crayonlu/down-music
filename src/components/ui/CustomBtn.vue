<script lang="ts" setup>
  defineProps({
    type: {
      type: String as () => 'primary' | 'secondary' | 'ghost' | 'text',
      default: 'secondary',
    },
    size: {
      type: String as () => 'small' | 'medium' | 'large',
      default: 'medium',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
  })

  defineEmits(['click'])
</script>

<template>
  <button
    class="custom-btn"
    :class="[
      `btn-${type}`,
      `btn-${size}`,
      { 'is-disabled': disabled, 'is-loading': loading, 'is-block': block },
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="loading-spinner"></span>
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
  .custom-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    outline: none;
    user-select: none;
    white-space: nowrap;

    &.is-block {
      width: 100%;
    }

    &.is-disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &.is-loading {
      cursor: wait;
    }

    &.btn-small {
      padding: 6px 12px;
      font-size: 13px;
      height: 28px;
    }

    &.btn-medium {
      padding: 8px 16px;
      font-size: 14px;
      height: 36px;
    }

    &.btn-large {
      padding: 10px 20px;
      font-size: 15px;
      height: 44px;
    }

    &.btn-primary {
      background: var(--accent-primary);
      color: var(--bg-elevated);

      &:hover:not(.is-disabled):not(.is-loading) {
        background: var(--accent-hover);
      }

      &:active:not(.is-disabled):not(.is-loading) {
        transform: translateY(1px);
      }
    }

    &.btn-secondary {
      background: var(--bg-secondary);
      color: var(--text-primary);
      border: 1px solid var(--border-color);

      &:hover:not(.is-disabled):not(.is-loading) {
        background: var(--bg-elevated);
        border-color: var(--accent-primary);
      }

      &:active:not(.is-disabled):not(.is-loading) {
        transform: translateY(1px);
      }
    }

    &.btn-ghost {
      background: transparent;
      color: var(--accent-primary);
      border: 1px solid var(--accent-primary);

      &:hover:not(.is-disabled):not(.is-loading) {
        background: var(--accent-primary);
        color: var(--bg-elevated);
      }

      &:active:not(.is-disabled):not(.is-loading) {
        transform: translateY(1px);
      }
    }

    &.btn-text {
      background: transparent;
      color: var(--text-primary);
      padding: 4px 8px;

      &:hover:not(.is-disabled):not(.is-loading) {
        color: var(--accent-primary);
        background: var(--bg-secondary);
      }

      &:active:not(.is-disabled):not(.is-loading) {
        transform: scale(0.98);
      }
    }

    .loading-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 480px) {
    .custom-btn {
      &.btn-small {
        padding: 5px 10px;
        font-size: 12px;
        height: 26px;
      }

      &.btn-medium {
        padding: 7px 14px;
        font-size: 13px;
        height: 34px;
      }

      &.btn-large {
        padding: 9px 18px;
        font-size: 14px;
        height: 40px;
      }
    }
  }
</style>
