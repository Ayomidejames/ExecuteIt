import axios from 'axios';

// The backend server express instance runs on a port we'll proxy via Vite.
const axiosClient = axios.create({
  baseURL: '/api', 
  withCredentials: true, // Crucial: This ensures HttpOnly cookies are passed to the backend
  headers: {
    'Content-Type': 'application/json',
  }
});

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if error response exists
    if (error.response) {
      // Intercept 403 where user is unverified
      if (error.response.status === 403 && error.response.data?.msg === 'User not verified.') {
        // Return a customized rejection we can quickly check in the component
        console.warn('Axios interceptor: User must be verified via OTP.');
        return Promise.reject({ 
            isUnverified: true, 
            message: error.response.data.msg, 
            error 
        });
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
