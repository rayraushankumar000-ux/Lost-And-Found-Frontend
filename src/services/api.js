import axios from 'axios';

const API = axios.create({
  baseURL: 'https://lost-and-found-backend-krax.vercel.app/api' // Backend port

});
// Get base URL from environment variable or use default
const BASE_API_URL = "https://lost-and-found-backend-krax.vercel.app/api";

const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: false, // Set to true if using cookies for auth
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - attach token automatically
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  response => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', response.config.url, response.status);
    }
    return response;
  },
  error => {
    // Log errors with full details
    if (error.response) {
      // Server responded with error status
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('❌ Network Error:', {
        url: error.config?.url,
        message: 'No response from server. Is the backend running?'
      });
    } else {
      // Something else happened
      console.error('❌ Request Error:', error.message);
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid - clear localStorage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  register: (userData) => api.post('/auth/register', userData), // Alias for backward compatibility
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData)
};

// Items API methods
export const itemsAPI = {
  reportLost: (formData) => api.post('/items/report-lost', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  reportFound: (formData) => api.post('/items/report-found', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  createItem: (formData) => api.post('/items', formData, { // Generic create for backward compatibility
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  searchItems: (params) => api.get('/items/search', { params }), // Use /search endpoint
  getItemById: (id) => api.get(`/items/${id}`)
};

// Users API methods
export const usersAPI = {
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  getProfile: () => api.get('/users/profile')
};

// Image Recognition API methods
export const imageRecognitionAPI = {
  recognizeImage: (formData) => api.post('/image-recognition', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

// Admin API methods
export const adminAPI = {
  getReports: (params) => api.get('/admin/reports', { params }),
  getDashboardStats: () => api.get('/admin/dashboard')
};

// Dashboard API methods (for user dashboard)
export const dashboardAPI = {
  getStats: () => api.get('/admin/user-dashboard')
};

export default api;
