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
  update: (id, userData) => api.patch(`/users/${id}`, userData),
  
  // Upload user profilePicture
  uploadPhoto: (id, formData) => {
    return axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    }).post(`/users/${id}/profile-picture`, formData);
  },
  
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

// Tasks API functions
export const tasksAPI = {
  // Get all tasks
  getAll: () => api.get('/tasks'),
  
  // Get task by ID
  getById: (id) => api.get(`/tasks/${id}`),
  
  // Get tasks by user ID
  getByUserId: (userId) => api.get(`/tasks/${userId}/tasks`),
  
  // Get specific task by user ID and task ID
  getByUserIdAndTaskId: (userId, taskId) => api.get(`/tasks/${userId}/tasks/${taskId}`),
  
  // Create new task
  create: (taskData) => api.post('/tasks', taskData),
  
  // Update task
  update: (id, taskData) => api.patch(`/tasks/${id}`, taskData),
  
  // Delete task
  delete: (id) => api.delete(`/tasks/${id}`)
};

// Dashboard API functions
export const dashboardAPI = {
  // Get admin dashboard data
  getAdminDashboard: () => api.get('/dashboard/admin'),
  
  // Get supervisor dashboard data
  getSupervisorDashboard: (params) => api.get('/dashboard/supervisor', { params }),
  
  // Get staff dashboard data
  getStaffDashboard: (params) => api.get('/dashboard/staff', { params })
};

// Bias checking API functions
export const biasAPI = {
  // Check bias in task review
  checkTaskReviewBias: (taskId, reviewData) => api.post(`/bias/task/${taskId}`, reviewData),
  
  // Check bias in report review
  checkReportReviewBias: (reportId, reviewData) => api.post(`/bias/report/${reportId}`, reviewData)
};

export default api;
