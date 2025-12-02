// 本文件用来规定app内部使用的Song类型
import type { ParsedLyrics } from '@/utils/lyricsParser'
import type { Platform } from '@/types/platform'
interface Artist {
  id: number | string
  name: string
}

interface Album {
  id: number | string
  name: string
  picUrl?: string
}

interface SongData {
  platform: Platform
  // 歌曲ID，可能是数字或字符串
  // 目前来说
  // 对于网易云是number
  // 对于酷狗是string
  id: number | string
  name: string
  picUrl?: string
  artists: Artist[]
  album: Album
  duration: number
  songUrl: string
  lyrics?: ParsedLyrics
}

interface SearchRes {
  songs: SongData[]
  total: number
}

export type { SongData, Artist, Album, SearchRes }
