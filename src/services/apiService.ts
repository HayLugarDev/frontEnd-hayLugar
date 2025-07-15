import axios from 'axios';
import { useUserStore } from '../store/userStore';

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const baseURL = import.meta.env.VITE_BASE_URL

const api = axios.create({
  baseURL: apiBaseUrl || "http://localhost:3000/api",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const userStore = useUserStore();
      userStore.setSessionExpired(true);
    }
    return Promise.reject(error);
  }
);

export default api;
