// 本文件用来规定app内部使用的Song类型
import type { ParsedLyrics } from '@/utils/lyricsParser'
import { getCurrentLyric, getCurrentLyricIndex, getLyricTimeRange } from '@/utils/lyricsParser'
import dayjs from 'dayjs'
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
  lyrics?: ParsedLyrics
}

/**
 * 歌曲类 - 封装歌曲数据和操作方法
 * @author crayon
 * @date 2025-11-30
 */
class Song {
  public readonly id: number | string
  public readonly name: string
  public readonly picUrl?: string
  public readonly artists: Artist[]
  public readonly album: Album
  public readonly duration: number
  public lyrics?: ParsedLyrics

  constructor(data: SongData) {
    this.id = data.id
    this.name = data.name
    this.picUrl = data.picUrl
    this.artists = data.artists
    this.album = data.album
    this.duration = data.duration
    this.lyrics = data.lyrics
  }

  /**
   * 获取歌曲主要艺术家名称
   */
  get mainArtist(): string {
    return this.artists[0]?.name || '未知艺术家'
  }

  /**
   * 获取所有艺术家名称字符串
   */
  get artistsString(): string {
    return this.artists.map(artist => artist.name).join(' ')
  }

  /**
   * 获取歌曲显示标题（包含艺术家）
   */
  get displayTitle(): string {
    return `${this.name} - ${this.artistsString}`
  }

  /**
   * 获取专辑封面URL
   * 优先使用歌曲封面，其次是专辑封面
   */
  get coverUrl(): string | undefined {
    return this.picUrl || this.album.picUrl
  }

  /**
   * 格式化时长为 mm:ss 格式
   */
  get formattedDuration(): string {
    return dayjs.duration(this.duration).format('mm:ss')
  }

  /**
   * 设置歌词
   */
  setLyrics(lyrics: ParsedLyrics): void {
    this.lyrics = lyrics
  }

  /**
   * 获取当前时间对应的歌词
   */
  getCurrentLyric(currentTime: number) {
    if (!this.lyrics) return null
    return getCurrentLyric(this.lyrics, currentTime)
  }

  /**
   * 获取当前时间对应的歌词索引
   */
  getCurrentLyricIndex(currentTime: number): number {
    if (!this.lyrics) return -1
    return getCurrentLyricIndex(this.lyrics, currentTime)
  }

  /**
   * 获取指定歌词行的时间范围
   */
  getLyricTimeRange(index: number) {
    if (!this.lyrics) return { startTime: 0, endTime: 0 }
    return getLyricTimeRange(this.lyrics, index)
  }

  /**
   * 检查是否有歌词
   */
  get hasLyrics(): boolean {
    return !!(this.lyrics && this.lyrics.lines.length > 0)
  }

  /**
   * 创建歌曲副本
   */
  clone(): Song {
    return new Song({
      id: this.id,
      name: this.name,
      picUrl: this.picUrl,
      artists: [...this.artists],
      album: { ...this.album },
      duration: this.duration,
      lyrics: this.lyrics ? { ...this.lyrics } : undefined,
    })
  }

  toJSON(): SongData {
    return {
      id: this.id,
      name: this.name,
      picUrl: this.picUrl,
      artists: this.artists,
      album: this.album,
      duration: this.duration,
      lyrics: this.lyrics,
    }
  }

  static fromJSON(data: SongData): Song {
    return new Song(data)
  }
}

export type SongInterface = SongData

export type { SongData, Artist, Album }
export { Song }
