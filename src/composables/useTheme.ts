import { useLocalStorage } from '@vueuse/core'
import { watchEffect } from 'vue'

type Theme = 'light' | 'dark'

export function useTheme() {
  const theme = useLocalStorage<Theme>('theme', 'light')

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  const toggleTheme = async (event?: MouseEvent) => {
    if (!document.startViewTransition || !event) {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
      return
    }

    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    const transition = document.startViewTransition(() => {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    })

    await transition.ready

    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
      },
      {
        duration: 500,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      },
    )
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
