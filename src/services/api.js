import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const AUTH_BASE_URL = 'http://localhost:8080/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (userData) => axios.post(`${AUTH_BASE_URL}/signup`, userData, { withCredentials: true }),
  login: (credentials) => axios.post(`${AUTH_BASE_URL}/login`, credentials, { withCredentials: true }),
  logout: () => axios.post(`${AUTH_BASE_URL}/logout`, {}, { withCredentials: true }),
  getCurrentUser: () => axios.get(`${API_BASE_URL}/auth/me`, { withCredentials: true }), // ✅ ADD THIS
  getOAuthUrl: () => 'http://localhost:8080/oauth2/authorization/google',
};

// Quantity APIs
export const quantityAPI = {
  compare: (data) => api.post('/quantities/compare', data),
  convert: (data) => api.post('/quantities/convert', data),
  add: (data) => api.post('/quantities/add', data),
  subtract: (data) => api.post('/quantities/subtract', data),
  multiply: (data) => api.post('/quantities/multiply', data),
  divide: (data) => api.post('/quantities/divide', data),
  getUnits: () => api.get('/quantities/units'),
};

export const historyAPI = {
  getAll: (limit = 50) => api.get(`/history?limit=${limit}`),
  getByOperation: (operation) => api.get(`/history/operation/${operation}`),
  getByType: (type) => api.get(`/history/type/${type}`),
  getErrors: () => api.get('/history/errors'),
  getCount: (operation) => api.get(`/history/count/${operation}`),
};

export default api;