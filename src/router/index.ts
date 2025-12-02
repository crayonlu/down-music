import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/search',
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/SearchView.vue'),
      meta: { title: '搜索音乐' },
    },
    {
      path: '/download',
      name: 'Download',
      component: () => import('@/views/DownloadView.vue'),
      meta: { title: '下载列表' },
    },
    {
      path: '/playlist',
      name: 'Playlist',
      component: () => import('@/views/PlaylistView.vue'),
      meta: { title: '播放列表' },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { title: '设置' },
    },
  ],
})

export default router
