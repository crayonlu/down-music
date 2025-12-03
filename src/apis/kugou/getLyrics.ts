import { apiClient } from '../base'

async function getPrefix(hash: string) {
  const response = await apiClient('kugou').get('/search/lyric', {
    params: {
      hash,
    },
  })
  const result = {
    id: response.data.candidates[0].id,
    accesskey: response.data.candidates[0].accesskey,
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
  const response = await apiClient('kugou').get('/lyric', {
    params: {
      id,
      accesskey,
      fmt: 'lrc',
      decode: 1,
    },
  })
  return response.data.decodeContent
}

export { getLyrics }
