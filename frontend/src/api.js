import axios from 'axios';

const isLocalDev =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_URL = process.env.REACT_APP_API_URL || (isLocalDev ? 'http://localhost:5000/api' : '');

if (!process.env.REACT_APP_API_URL && !isLocalDev) {
  // In production, the frontend must be configured with the deployed backend URL.
  console.warn(
    'REACT_APP_API_URL is not set. Configure it in Railway to point to your deployed backend, for example https://<backend-app>.up.railway.app/api.'
  );
}

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
