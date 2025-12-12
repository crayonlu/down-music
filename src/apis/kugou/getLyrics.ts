import { z } from 'zod'
import { apiClient } from '@/apis/base'

const KuGouLyricSearchSchema = z
  .object({ candidates: z.array(z.object({ id: z.number(), accesskey: z.string() })).optional() })
  .optional()
const KuGouLyricDecodeSchema = z.object({ decodeContent: z.string().optional() }).optional()

async function getPrefix(hash: string) {
  const response = await apiClient('kugou').get('/search/lyric', {
    params: {
      hash,
    },
  })
  const parsed = KuGouLyricSearchSchema.safeParse(response.data)
  if (!parsed.success || !(parsed.data?.candidates && parsed.data.candidates[0])) {
    console.warn('Unexpected KuGou lyric search response', parsed.error)
    return { id: 0, accesskey: '' }
  }
  const result = {
    id: parsed.data.candidates[0].id,
    accesskey: parsed.data.candidates[0].accesskey,
  }
  return result
}

/**
 * 必选参数：
 * id: 歌词 id, 可以从 /search/lyric 接口中获取
 * accesskey: 歌词 accesskey, 可以从 /search/lyric 接口中获取
 */
async function getLyrics(hash: string): Promise<string> {
  const { id, accesskey } = await getPrefix(hash)
  if (!id || !accesskey) return ''
  const response = await apiClient('kugou').get('/lyric', {
    params: {
      id,
      accesskey,
      fmt: 'lrc',
      decode: 1,
    },
  })
  const parsed = KuGouLyricDecodeSchema.safeParse(response.data)
  if (!parsed.success) {
    console.warn('Unexpected KuGou lyric decode response', parsed.error)
    return ''
  }
  return parsed.data?.decodeContent ?? ''
}

export { getLyrics }
