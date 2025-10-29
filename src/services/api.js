import axios from 'axios';

const API = axios.create({
  baseURL: 'https://lost-and-found-backend-1-igk1.onrender.com' // Backend port
});

// Your React app: http://localhost:3001
// Your Backend: http://localhost:5000

// Add token to requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getProfile: () => API.get('/auth/me'),
};

export const itemsAPI = {
  create: (itemData) => API.post('/items', itemData),
  getAll: (params) => API.get('/items', { params }),
  get: (id) => API.get(`/items/${id}`),
  claim: (id) => API.post(`/items/${id}/claim`),
};

export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
};

export default API;
