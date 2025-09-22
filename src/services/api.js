import axios from 'axios';

// Single axios instance. Prefer explicit backend URL via REACT_APP_API_URL.
// If not set and we're in development, default to the backend dev server
// at http://localhost:9000 to avoid accidental requests to the frontend host (3000).
// In production, default to '/' so relative paths are used.
const defaultDevApi = 'http://localhost:9000';
const baseURL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'development' ? defaultDevApi : '/');
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach auth token if present in localStorage under 'access_token'
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore (e.g., restricted storage)
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally: clear token and redirect to /login (dev behavior)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err && err.response && err.response.status === 401) {
      try {
        // Clear tokens locally; don't force a redirect here. Let AuthContext decide UX.
        localStorage.removeItem('access_token');
        localStorage.removeItem('token');
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(err);
  }
);

export default api;

// Authentication helpers (named export used by AuthContext)
export const authApi = {
  // login returns response.data (so callers can read access_token directly)
  login: async (email, password) => {
    const resp = await api.post('/auth/login', { email, password });
    return resp.data;
  },

  register: (userData) => api.post('/auth/register', userData),

  getCurrentUser: () => api.get('/auth/me'),

  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, new_password: newPassword }),

  logout: () => api.post('/auth/logout'),
};

