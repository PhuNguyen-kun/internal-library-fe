import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import router from '@/router'

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  onStart?: () => void
  onEnd?: () => void
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 99999999
})

axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    if (config.onStart) {
      config.onStart()
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as CustomAxiosRequestConfig

    if (config.onEnd) {
      config.onEnd()
    }
    return response
  },
  (error) => {
    const config = error.config as CustomAxiosRequestConfig

    if (config && config.onEnd) {
      config.onEnd()
    }

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      window.alert('Your session has expired. Please log in again.');

      localStorage.removeItem('access_token');
      location.reload();
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
