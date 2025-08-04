import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/'; // Redirect to sign-in page
    }
    return Promise.reject(error);
  }
);

// User/Account API functions
export const accountsAPI = {
  // Get all users/accounts
  getAll: () => api.get('/users'),
  
  // Get user by ID
  getById: (id) => api.get(`/users/${id}`),
  
  // Create new user/account
  create: (userData) => api.post('/users', userData),
  
  // Update user/account
  update: (id, userData) => api.put(`/users/${id}`, userData),
  
  // Delete user/account
  delete: (id) => api.delete(`/users/${id}`)
};

// Jobs API functions
export const jobsAPI = {
  // Get all jobs
  getAll: () => api.get('/jobs'),
  
  // Get job by ID
  getById: (id) => api.get(`/jobs/${id}`),
  
  // Create new job
  create: (jobData) => api.post('/jobs', jobData),
  
  // Update job
  update: (id, jobData) => api.patch(`/jobs/${id}`, jobData),
  
  // Delete job
  delete: (id) => api.delete(`/jobs/${id}`)
};

export default api;
