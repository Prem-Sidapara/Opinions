import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Lazy initialization from localStorage (Stale)
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    // Loading is effectively false if we have a user (instant load), or true if we have nothing and need to check
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            // Stale-While-Revalidate: If we have a user, do NOT show loading (instant load)
            // If we lack a user (first run/cleared cache), we MUST show loading
            if (!user) setLoading(true);

            const retries = 3;
            let attempt = 0;
            let success = false;

            // We loop ONLY if we don't have a cached user (Critical Path)
            // If we have a cached user, we try once (Background Sync) and don't block
            const maxAttempts = user ? 1 : retries;

            while (attempt < maxAttempts && !success) {
                try {
                    console.log(`Verifying token (Attempt ${attempt + 1}/${maxAttempts})...`);
                    const res = await api.get('/auth/user');
                    console.log("User verified:", res.data);

                    // Update state & cache
                    setUser(res.data);
                    localStorage.setItem('user', JSON.stringify(res.data));
                    success = true;
                } catch (err) {
                    attempt++;
                    console.error("Auth check failed:", err.response?.status, err.message);

                    // 1. Invalid Token (401) - Logout immediately
                    if (err.response && err.response.status === 401) {
                        console.log("Token invalid (401), logging out.");
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                        break;
                    }

                    // 2. Server/Network Error
                    // If we have a cached user, we ignore errors (stay "Offline")
                    if (user) {
                        console.warn("Background sync failed. Using cached user payload.");
                        break;
                    }

                    // If we DO NOT have a cached user, we must RETRY to wake up the server
                    if (attempt < maxAttempts) {
                        const delay = attempt * 1000;
                        console.log(`Cold start detected? Retrying in ${delay}ms...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    } else {
                        console.error("All retries failed. Cannot verify user.");
                    }
                }
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []); // Run once on mount

    const loginWithOtp = async (email, otp) => {
        const res = await api.post('/auth/otp/verify', { email, otp });
        // Save Token
        localStorage.setItem('token', res.data.token);
        // Save User (Cache)
        localStorage.setItem('user', JSON.stringify(res.data.user));
        // Set State
        setUser(res.data.user);
    };

    const googleLogin = async (credentialResponse) => {
        const res = await api.post('/auth/google', { googleToken: credentialResponse.credential });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginWithOtp, googleLogin, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
