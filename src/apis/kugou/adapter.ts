import type { SongData } from '@/types/internal/song'
import { z } from 'zod'

export const KuGouSingerSchema = z.object({ id: z.number(), name: z.string().optional() })

export const KuGouListItemSchema = z.object({
  Image: z.string().optional(),
  AlbumID: z.string().optional(),
  AlbumName: z.string().optional(),
  FileHash: z.string(),
  Res: z.object({ FileSize: z.number().optional(), TimeLength: z.number().optional() }).optional(),
  Singers: z.array(KuGouSingerSchema).optional(),
  Duration: z.number().optional(),
  OriSongName: z.string().optional(),
})

export const KuGouSearchResultSchema = z.object({
  total: z.number(),
  lists: z.array(KuGouListItemSchema),
})

export type KuGouListItem = z.infer<typeof KuGouListItemSchema>

// Search suggest schema for kugou
export const KuGouSuggestRecordSchema = z.object({
  HintInfo: z.string(),
  Hot: z.number().optional(),
})
export const KuGouSuggestCategorySchema = z.object({
  RecordDatas: z.array(KuGouSuggestRecordSchema),
  RecordCount: z.number().optional(),
  LableName: z.string().optional(),
})
export const KuGouSuggestResultSchema = z.array(KuGouSuggestCategorySchema)

// Song quality schema for kugou getSongURL
export const KuGouSongInfoSchema = z.object({
  filesize: z.number().optional(),
  extname: z.string().optional(),
  bitrate: z.number().optional(),
  duration: z.number().optional(),
  tracker_url: z.array(z.string()).optional(),
})

export const KuGouSongQualitySchema = z.object({
  hash: z.string(),
  info: KuGouSongInfoSchema,
  quality: z.string().optional(),
})

export const KuGouSongQualityListSchema = z.array(KuGouSongQualitySchema)

export function normalizeKuGouSong(item: KuGouListItem): SongData {
  return {
    platform: 'kugou',
    id: item.FileHash,
    name: item.OriSongName ?? '',
    picUrl: item.Image ?? undefined,
    artists: (item.Singers ?? []).map(a => ({ id: a.id, name: a.name ?? '' })),
    album: { id: item.AlbumID ?? '', name: item.AlbumName ?? '', picUrl: item.Image ?? undefined },
    duration: (item.Duration ?? 0) * 1000,
    songUrl: '',
  }
}
