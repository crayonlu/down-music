import type { SongData } from '@/types/internal/song'
import { z } from 'zod'

// zod schema for a single NetEase song
export const NetEaseArtistSchema = z.object({ id: z.number(), name: z.string() })

export const NetEaseAlbumSchema = z.object({
  id: z.number(),
  name: z.string(),
  picUrl: z.string().optional(),
})

export const NetEaseSongSchema = z.object({
  id: z.number(),
  name: z.string(),
  ar: z.array(NetEaseArtistSchema).optional(),
  al: NetEaseAlbumSchema.optional(),
  dt: z.number().optional(),
  fee: z.number().optional(),
})

export const NetEaseSearchResultSchema = z.object({
  songs: z.array(NetEaseSongSchema),
  songCount: z.number().optional(),
})

export type NetEaseSong = z.infer<typeof NetEaseSongSchema>

// Search suggest schema (different shape: `artists`, `album`, `artists` vs `ar`, `al`)
export const NetEaseSuggestSongSchema = z.object({
  id: z.number(),
  name: z.string(),
  artists: z.array(NetEaseArtistSchema).optional(),
  album: z
    .object({
      id: z.number().optional(),
      name: z.string().optional(),
      artist: z.any().optional(),
      picUrl: z.string().optional(),
    })
    .optional(),
  duration: z.number().optional(),
})

export const NetEaseSearchSuggestSchema = z
  .object({
    songs: z.array(NetEaseSuggestSongSchema).optional(),
    artists: z.array(NetEaseArtistSchema).optional(),
    albums: z.array(NetEaseAlbumSchema).optional(),
  })
  .optional()

export function normalizeNetEaseSuggestSong(
  song: z.infer<typeof NetEaseSuggestSongSchema>,
): SongData {
  return {
    platform: 'netease',
    id: song.id,
    name: song.name,
    picUrl: song.album?.picUrl,
    artists: (song.artists ?? []).map(a => ({ id: a.id, name: a.name })),
    album: { id: song.album?.id ?? 0, name: song.album?.name ?? '', picUrl: song.album?.picUrl },
    duration: song.duration ?? 0,
    songUrl: '',
  }
}

// Song URL schema for netease getSongURL
export const NetEaseSongUrlSchema = z.object({
  id: z.number(),
  url: z.string(),
  br: z.number(),
  size: z.number(),
  md5: z.string(),
  code: z.number(),
  type: z.string().optional(),
  level: z.string().optional(),
  time: z.number().optional(),
})

export const NetEaseSongUrlListSchema = z.array(NetEaseSongUrlSchema)

export function normalizeNetEaseSong(song: NetEaseSong): SongData {
  return {
    platform: 'netease',
    id: song.id,
    name: song.name,
    picUrl: song.al?.picUrl,
    artists: (song.ar ?? []).map(a => ({ id: a.id, name: a.name })),
    album: {
      id: song.al?.id ?? 0,
      name: song.al?.name ?? '',
      picUrl: song.al?.picUrl,
    },
    duration: song.dt ?? 0,
    songUrl: '',
  }
}
