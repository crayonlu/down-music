import { Cloud, Dog } from 'lucide-vue-next'

const platformIconMap: Record<string, typeof Cloud> = {
  netease: Cloud,
  kugou: Dog,
}

const platformOptions = Object.keys(platformIconMap).map(key => ({
  label: key.charAt(0).toUpperCase() + key.slice(1),
  value: key,
}))

function getPlatformIcon(platform: string): typeof Cloud | undefined {
  return platformIconMap[platform]
}

export { platformIconMap, platformOptions, getPlatformIcon }
