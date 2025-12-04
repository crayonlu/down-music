<script lang="ts" setup>
  import { autoUpdate, flip, offset, shift, size, useFloating } from '@floating-ui/vue'
  import { ChevronRight } from 'lucide-vue-next'
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  defineProps({
    modelValue: {
      type: String,
      default: '',
    },
    options: {
      type: Array as () => { label: string; value: string }[],
      required: true,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const reference = ref<HTMLElement | null>(null)
  const floating = ref<HTMLElement | null>(null)
  const isOpen = ref(false)

  const { floatingStyles } = useFloating(reference, floating, {
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

  const toggleDropdown = () => {
    isOpen.value = !isOpen.value
  }
  const selectOption = (value: string) => {
    emit('update:modelValue', value)
    isOpen.value = false
  }

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (
      reference.value &&
      floating.value &&
      !reference.value.contains(target) &&
      !floating.value.contains(target)
    ) {
      isOpen.value = false
    }
  }
  onMounted(() => document.addEventListener('click', handleClickOutside))
  onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>
<template>
  <div class="select-wrapper" ref="reference">
    <div class="select-trigger" :class="{ 'is-active': isOpen }" @click="toggleDropdown">
      <span class="trigger-content">
        <slot name="trigger" :modelValue="modelValue" :options="options">
          {{ modelValue || placeholder }}
        </slot>
      </span>
      <ChevronRight class="arrow" :class="{ 'is-rotated': isOpen }" />
    </div>

    <teleport to="body">
      <div v-if="isOpen" ref="floating" class="select-dropdown" :style="floatingStyles">
        <div
          v-for="item in options"
          :key="item.value"
          class="select-option"
          :class="{ 'is-selected': item.value === modelValue }"
          @click="selectOption(item.value)"
        >
          <slot name="option" :option="item">
            {{ item.label }}
          </slot>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style scoped lang="scss">
  .select-wrapper {
    position: relative;
    width: 100%;

    .select-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s;
      user-select: none;

      &:hover {
        border-color: var(--accent-primary);
      }

      &.is-active {
        border-color: var(--accent-primary);
        box-shadow: var(--shadow-sm);
      }

      span {
        font-size: 14px;
        color: var(--text-primary);
        flex: 1;

        &:empty::before {
          content: attr(data-placeholder);
          color: var(--text-tertiary);
        }
      }

      .trigger-content {
        font-size: 14px;
        color: var(--text-primary);
        flex: 1;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .arrow {
        width: 16px;
        height: 16px;
        color: var(--text-secondary);
        transition: transform 0.2s;
        transform: rotate(90deg);

        &.is-rotated {
          transform: rotate(270deg);
        }
      }
    }
  }

  .select-dropdown {
    background: var(--bg-elevated);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    box-shadow: var(--shadow-md);
    overflow: hidden;
    z-index: 1000;
    padding: 2px 0;

    .select-option {
      padding: 8px 12px;
      font-size: 14px;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.15s;
      user-select: none;
      display: flex;
      align-items: center;
      gap: 6px;

      &:hover {
        background: var(--bg-secondary);
      }

      &.is-selected {
        background: var(--bg-secondary);
        color: var(--accent-primary);
        font-weight: 500;
      }
    }
  }

  @media (max-width: 480px) {
    .select-wrapper {
      .select-trigger {
        padding: 7px 10px;

        .trigger-content {
          font-size: 13px;
        }

        .arrow {
          width: 14px;
          height: 14px;
        }
      }
    }

    .select-dropdown {
      .select-option {
        padding: 7px 10px;
        font-size: 13px;
      }
    }
  }
</style>
