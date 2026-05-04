import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// HARDCODED for production - using your backend domain directly
const api = axios.create({
  baseURL: 'https://api.dentalappeal.claims/api',
});

// Log to confirm it's working
console.log('🔥 API Client initialized with URL:', api.defaults.baseURL);

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
