import axios from 'axios';

// Use relative path by default to leverage proxies (Vite in dev, Vercel in prod)
// Only use VITE_API_URL if explicitly set and we want to bypass proxy (rare)
const baseURL = import.meta.env.VITE_API_URL || '/api';

console.log("API Base URL:", baseURL);

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
