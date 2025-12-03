import { Cloud, Dog } from 'lucide-vue-next'

const platformIconMap = {
  netease: {
    display: '网易云',
    icon: Cloud,
  },
  kugou: {
    display: '酷狗音乐',
    icon: Dog,
  },
} as const

type PlatformKey = keyof typeof platformIconMap

const platformOptions = (Object.keys(platformIconMap) as Array<PlatformKey>).map(key => ({
  label: platformIconMap[key].display,
  value: key,
}))

function getPlatformIcon(platform: string) {
  return platformIconMap[platform as PlatformKey]?.icon
}

export { getPlatformIcon, platformIconMap, platformOptions }
export type { PlatformKey }
