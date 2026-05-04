import axios from 'axios';

// ✅ Dynamically set baseURL from .env for Dual Mode Support (Gateway vs Direct)
const api = axios.create({
  baseURL: '/gateway',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor — attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;