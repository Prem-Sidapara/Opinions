import axios from 'axios';

// Use relative path by default to leverage proxies (Vite in dev, Vercel in prod)
// Only use VITE_API_URL if explicitly set.
let baseURL = import.meta.env.VITE_API_URL || '/api';

// Ensure baseURL ends with /api if it doesn't already
if (!baseURL.endsWith('/api')) {
    baseURL += '/api';
}

// Fix double slashes if any (e.g., example.com//api)
baseURL = baseURL.replace(/([^:]\/)\/+/g, "$1");

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
