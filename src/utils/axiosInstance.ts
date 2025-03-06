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

axiosInstance.interceptors.response.use(
  (response) => {
    loadingStore.finishLoading();
    return response;
  },
  async (error) => {
    console.error("Axios error:", error.response);

    const adminToken = localStorage.getItem("admin_access_token");
    const userToken = localStorage.getItem("user_access_token");

    if (error.response && error.response.status === 401) {
      const url = error.config.url;

      if (url.includes("/api/user/")) {
        window.alert("Your session has expired. Please log in again.");
        localStorage.removeItem("user_access_token");
        await router.replace("/homepage");
      }

      if (url.includes("/api/admin/") && userToken) {
        console.warn("Ignoring 401 error from admin API for user.");
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
