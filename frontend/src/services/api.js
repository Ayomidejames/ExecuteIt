import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Authentication
export const login = (credentials) => api.post('/user/SignIn', credentials);
export const register = (userData) => api.post('/user/register', userData);
export const logout = () => api.post('/user/logout');
export const resetPasswordRequest = (data) => api.post('/password/resetRequest', data);
export const validatePasswordToken = (data) => api.post('/password/validate', data);
export const resetPassword = (data) => api.post('/password/reset', data);

// OTP
export const verifyOtp = (data) => api.post('/verify', data);
export const resendOtp = (data) => api.post('/resendOTP', data);

// User Profile
export const getUserProfile = () => api.get('/user/profile');
export const updateProfile = (data) => api.put('/user/profile', data);

// Tasks
export const getTasks = () => api.get('/getTasks');
export const getTask = (id) => api.get(`/getTask/${id}`);
export const createTask = (taskData) => api.post('/addTask', taskData);
export const updateTask = (id, taskData) => api.put(`/updateTask/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/removeTask/${id}`);

export default api;
