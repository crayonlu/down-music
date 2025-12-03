import { getSongURL as getKugouSongURL } from '@/apis/kugou/getSongURL'
import { getSongURL as getNeteaseSongURL } from '@/apis/netease/getSongURL'
import type { SongData } from '@/types/internal/song'
import { ref } from 'vue'

interface DownloadTask {
  song: SongData
  progress: number
  status: 'pending' | 'downloading' | 'completed' | 'failed'
  error?: string
}

/**
 * 下载功能的组合式函数
 * @author crayon
 * @date 2025-12-03
 */
export function useDownload() {
  const downloadTasks = ref<Map<string, DownloadTask>>(new Map())

  /**
   * 获取歌曲的下载URL
   */
  const getSongDownloadUrl = async (song: SongData): Promise<string> => {
    switch (song.platform) {
      case 'netease': {
        const data = await getNeteaseSongURL(Number(song.id), 0)
        return data[0] ? data[0].url : ''
      }
      case 'kugou': {
        const qualities = await getKugouSongURL(song.id as string)
        // 选择最高质量的音频
        if (qualities.length > 0) {
          const bestQuality = qualities[0]
          if (bestQuality) {
            const trackerUrl = bestQuality.info.tracker_url[0] || ''
            return `${trackerUrl}${bestQuality.hash}.${bestQuality.info.extname}`
          }
        }
        throw new Error('未找到可用的下载链接')
      }
      default:
        throw new Error('不支持的平台')
    }
  }

  /**
   * 下载歌曲
   */
  const downloadSong = async (song: SongData) => {
    const taskId = `${song.platform}-${song.id}`

    if (downloadTasks.value.has(taskId)) {
      const task = downloadTasks.value.get(taskId)
      if (task?.status === 'downloading') {
        console.log('歌曲正在下载中')
        return
      }
    }

    const task: DownloadTask = {
      song,
      progress: 0,
      status: 'pending',
    }
    downloadTasks.value.set(taskId, task)

    try {
      task.status = 'downloading'

      const url = await getSongDownloadUrl(song)

      if (!url) {
        throw new Error('获取下载链接失败')
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('下载失败')
      }

      const reader = response.body?.getReader()
      const contentLength = Number(response.headers.get('Content-Length')) || 0

      if (!reader) {
        throw new Error('无法读取响应')
      }

      const chunks: Uint8Array[] = []
      let receivedLength = 0

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        chunks.push(value)
        receivedLength += value.length

        if (contentLength > 0) {
          task.progress = Math.round((receivedLength / contentLength) * 100)
        }
      }

      const blob = new Blob(chunks as BlobPart[])

      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${song.name} - ${song.artists.map(a => a.name).join(', ')}.mp3`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)

      task.status = 'completed'
      task.progress = 100
    } catch (error) {
      task.status = 'failed'
      task.error = error instanceof Error ? error.message : '下载失败'
      console.error('下载失败:', error)
      throw error
    }
  }

  /**
   * 获取下载任务
   */
  const getDownloadTask = (song: SongData): DownloadTask | undefined => {
    const taskId = `${song.platform}-${song.id}`
    return downloadTasks.value.get(taskId)
  }

  /**
   * 清除已完成的任务
   */
  const clearCompletedTasks = () => {
    const tasks = Array.from(downloadTasks.value.entries())
    tasks.forEach(([id, task]) => {
      if (task.status === 'completed') {
        downloadTasks.value.delete(id)
      }
    })
  }

  return {
    downloadTasks,
    downloadSong,
    getDownloadTask,
    clearCompletedTasks,
  }
}
