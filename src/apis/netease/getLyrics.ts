import { apiClient } from '@/apis/base'
import { z } from 'zod'

const NetEaseLyricSchema = z
  .object({
    lrc: z.object({ lyric: z.string().optional() }).optional(),
    sgc: z.union([z.number(), z.boolean()]).optional(),
  })
  .optional()

async function getLyrics(id: number): Promise<string> {
  const response = await apiClient('netease').get('/lyric', {
    params: {
      id,
    },
  })
  const raw = response.data
  const parsed = NetEaseLyricSchema.safeParse(raw)
  if (!parsed.success) {
    console.warn('Unexpected NetEase lyric response', parsed.error)
    return ''
  }
  return parsed.data?.lrc?.lyric ?? ''
}

export { getLyrics }
