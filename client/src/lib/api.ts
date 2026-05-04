import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Use absolute URL in production, relative in development
const API_URL = import.meta.env.PROD 
  ? 'https://api.dentalappeal.claims/api'
  : '/api';

const api = axios.create({
  baseURL: API_URL,
});

console.log('API Base URL:', API_URL); // Debug log

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
