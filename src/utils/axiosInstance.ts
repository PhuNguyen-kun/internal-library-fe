import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import router from '@/router';
import { useLoadingStore } from '@/stores/Common/loading.store';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  onStart?: () => void;
  onEnd?: () => void;
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 99999999
});

const loadingStore = useLoadingStore();

axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    loadingStore.startLoading();
    const currentPath = window.location.pathname;
    let token: string | null = null;

    if (currentPath.startsWith('/admin')) {
      token = localStorage.getItem('admin_access_token');
    } else {
      token = localStorage.getItem('user_access_token');
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (config.onStart) {
      config.onStart();
    }

    return config;
  },
  (error) => {
    loadingStore.finishLoading();
    return Promise.reject(error);
  }
);

// axiosInstance.ts
axiosInstance.interceptors.response.use(
  (response) => {
    loadingStore.finishLoading();
    return response;
  },
  async (error) => {
    loadingStore.finishLoading(); // Luôn dừng loading khi có lỗi

    // Xử lý lỗi 401
    if (error.response?.status === 401) {
      // Xóa token cũ
      localStorage.removeItem('user_access_token');

      // Chỉ chuyển hướng nếu request thuộc API yêu cầu auth
      const isAuthRequiredApi = error.config.url.includes('/api/user/cart') ||
        error.config.url.includes('/api/user/wishlist') ||
        error.config.url.includes('/api/user/info');

      if (isAuthRequiredApi && !window.location.pathname.includes('/signup')) {
        await router.replace('/signup');
        window.alert('Vui lòng đăng nhập để tiếp tục');
      }
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
