import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

interface LyricLine {
  time: number // 时间戳（毫秒）
  text: string // 歌词文本
  originalTime: string // 原始时间标签 [mm:ss.xxx]
}

interface ParsedLyrics {
  lines: LyricLine[]
  metadata: {
    title?: string
    artist?: string
    album?: string
    author?: string
    [key: string]: string | undefined
  }
}

/**
 * 解析LRC格式歌词
 * @author crayon
 * @date 2025-11-29
 * @param lrcContent LRC歌词字符串
 * @returns 解析后的歌词对象
 */
function parseLyrics(lrcContent: string): ParsedLyrics {
  if (!lrcContent) {
    return { lines: [], metadata: {} }
  }

  const lines = lrcContent.split('\n')
  const lyricLines: LyricLine[] = []
  const metadata: ParsedLyrics['metadata'] = {}

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine) continue

    // 解析元数据 [ar:艺术家] [ti:标题] [al:专辑] [offset:时间偏移] 等
    const metadataMatch = trimmedLine.match(/^\[(\w+):(.+)\]$/)
    if (metadataMatch) {
      const [, key, value] = metadataMatch
      switch (key) {
        case 'ti':
          metadata.title = value
          break
        case 'ar':
          metadata.artist = value
          break
        case 'al':
          metadata.album = value
          break
        case 'au':
          metadata.author = value
          break
        default:
          if (key && value) {
            metadata[key] = value
          }
      }
      continue
    }

    // 解析歌词行 [mm:ss.xxx]歌词文本
    const timeMatches = trimmedLine.matchAll(/\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g)
    const timeTags = Array.from(timeMatches)

    if (timeTags.length === 0) continue

    const text = trimmedLine.replace(/\[\d{2}:\d{2}(?:\.\d{2,3})?\]/g, '').trim()

    for (const match of timeTags) {
      const minutes = match[1]
      const seconds = match[2]
      const milliseconds = match[3] || '00'

      if (minutes && seconds) {
        const timeDuration = dayjs.duration({
          minutes: parseInt(minutes),
          seconds: parseInt(seconds),
          milliseconds: parseInt(milliseconds.padEnd(3, '0').slice(0, 3)),
        })
        const time = timeDuration.asMilliseconds()

        lyricLines.push({
          time,
          text,
          originalTime: match[0],
        })
      }
    }
  }

  lyricLines.sort((a, b) => a.time - b.time)

  return {
    lines: lyricLines,
    metadata,
  }
}

/**
 * 根据当前播放时间获取应该显示的歌词行索引
 * @author crayon
 * @date 2025-11-29
 * @param lyrics 解析后的歌词
 * @param currentTime 当前播放时间（毫秒）
 * @returns 歌词行索引，如果没有匹配的则返回 -1
 */
function getCurrentLyricIndex(lyrics: ParsedLyrics, currentTime: number): number {
  if (!lyrics.lines.length) return -1
  // 找到最后一个时间小于等于当前时间的歌词行
  for (let i = lyrics.lines.length - 1; i >= 0; i--) {
    const line = lyrics.lines[i]
    if (line && line.time <= currentTime) return i
  }
  return -1
}

/**
 * 获取当前时间应该显示的歌词行
 * @param lyrics 解析后的歌词
 * @param currentTime 当前播放时间（毫秒）
 * @returns 当前歌词行，如果没有匹配的则返回 null
 */
function getCurrentLyric(lyrics: ParsedLyrics, currentTime: number): LyricLine | null {
  const index = getCurrentLyricIndex(lyrics, currentTime)
  return index >= 0 && lyrics.lines[index] ? lyrics.lines[index] : null
}

/**
 * 获取歌词行的时间范围（用于高亮显示）
 * @author crayon
 * @date 2025-11-29
 * @param lyrics 解析后的歌词
 * @param index 歌词行索引
 * @returns 时间范围 { startTime, endTime }
 */
function getLyricTimeRange(
  lyrics: ParsedLyrics,
  index: number,
): { startTime: number; endTime: number } {
  if (!lyrics.lines.length || index < 0 || index >= lyrics.lines.length)
    return { startTime: 0, endTime: 0 }

  const currentLine = lyrics.lines[index]
  if (!currentLine) return { startTime: 0, endTime: 0 }
  const startTime = currentLine.time
  const nextLine = lyrics.lines[index + 1]
  const endTime = nextLine ? nextLine.time : startTime + 5000

  return { startTime, endTime }
}

export { parseLyrics, getCurrentLyricIndex, getCurrentLyric, getLyricTimeRange }

export type { ParsedLyrics, LyricLine }
