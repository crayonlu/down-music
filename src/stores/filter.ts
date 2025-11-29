import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { NetEaseSearchType } from '@/types/search'
/**
 * 筛选状态store
 * @author crayon
 * @date 2025-11-29
 */
export const useFilterStore = defineStore('filter', () => {
  // 关键词 非空
  // 允许多个关键词 用空格分隔
  const keywords = ref('')
  // 返回数量
  const limit = ref(30)
  // 当前页
  const currentPage = ref(1)
  // 偏移数量
  const offset = computed(() => (currentPage.value - 1) * limit.value)
  // 1: 单曲
  // 10: 专辑
  // 100: 歌手
  // 1000: 歌单
  // 1002: 用户
  // 1004: MV
  // 1006: 歌词
  // 1009: 电台
  // 1014: 视频
  // 1018: 综合
  // 2000: 声音
  const type = ref<NetEaseSearchType>(1)
  return {
    keywords,
    limit,
    offset,
    type,
    currentPage,
  }
})
