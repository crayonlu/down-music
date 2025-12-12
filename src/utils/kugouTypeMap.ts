import type { KuGouSearchType } from '@/types/apis/search'

const typeMap: Record<KuGouSearchType, string> = {
  special: '歌单',
  lyric: '歌词',
  song: '单曲',
  album: '专辑',
  author: '歌手',
  mv: 'mv',
}

const typeReverseMap: Record<string, KuGouSearchType> = {
  歌单: 'special',
  歌词: 'lyric',
  单曲: 'song',
  专辑: 'album',
  歌手: 'author',
  mv: 'mv',
}

function getTypeByName(name: string): KuGouSearchType | undefined {
  return typeReverseMap[name] as KuGouSearchType | undefined
}

function getNameByType(type: KuGouSearchType): string | undefined {
  return typeMap[type]
}

export { getNameByType, getTypeByName, typeMap, typeReverseMap }
