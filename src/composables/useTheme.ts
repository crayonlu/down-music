import { useLocalStorage } from '@vueuse/core'
import { watchEffect } from 'vue'

type Theme = 'light' | 'dark'

export function useTheme() {
  const theme = useLocalStorage<Theme>('theme', 'light')

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const initTheme = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (!localStorage.getItem('theme')) theme.value = prefersDark ? 'dark' : 'light'
  }

  watchEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.value)
  })

  return {
    theme,
    setTheme,
    toggleTheme,
    initTheme,
  }
}
