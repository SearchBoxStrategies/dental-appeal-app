import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Production builds talk to the live API. In `npm run dev`, requests go to /api,
// which Vite proxies to the local backend (see vite.config.ts). VITE_API_URL overrides both.
export const API_BASE_URL: string = import.meta.env.VITE_API_URL
  || (import.meta.env.DEV ? '/api' : 'https://api.dentalappeal.claims/api');

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
