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
      path: '/playlist',
      name: 'Playlist',
      component: () => import('@/views/PlaylistView.vue'),
      meta: { title: '播放列表' },
    },
    {
      path: '/lyrics',
      name: 'Lyrics',
      component: () => import('@/views/LyricsView.vue'),
      meta: { title: '歌词显示' },
    },
  ],
})

export default router
