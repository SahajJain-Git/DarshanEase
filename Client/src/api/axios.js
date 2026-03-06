import axios from 'axios';

/**
 * Central Axios instance.
 * Base URL points to /api (proxied to http://localhost:5000 by Vite).
 * Request interceptor attaches stored JWT automatically.
 * Response interceptor handles 401 by clearing auth and redirecting.
 */
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Attach JWT to every outgoing request ──────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('de_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Handle expired / invalid token globally ───────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('de_token');
      localStorage.removeItem('de_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;