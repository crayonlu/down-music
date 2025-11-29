import axios, { type AxiosInstance } from 'axios'

const apiMap = {
  kugou: import.meta.env.VITE_KUGOU_API_URL || 'http://localhost:3001',
  netease: import.meta.env.VITE_NETEASE_API_URL || 'http://localhost:3002',
}

export function apiClient(type: keyof typeof apiMap): AxiosInstance {
  const baseURL = apiMap[type]
  return axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
