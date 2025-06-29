import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

// Read the base URL from the environment variable.
// The /api part is now part of the variable in development.
// In production, an empty string means requests will go to the same origin.

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
// Request Interceptor to add the auth token to headers
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from our auth store
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;