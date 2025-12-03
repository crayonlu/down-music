import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
/**
 * 格式化时间
 * @param milliseconds 毫秒
 * @returns HH:mm:ss / mm:ss
 */
const formatTime = (milliseconds: number): string => {
  return dayjs.duration(milliseconds).format(milliseconds >= 3600000 ? 'HH:mm:ss' : 'mm:ss')
}

export { formatTime }
