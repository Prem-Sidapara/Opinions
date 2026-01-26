import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Token is handled by api interceptor
                    const res = await api.get('/auth/user');
                    setUser(res.data);
                } catch (err) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    const loginWithOtp = async (email, otp) => {
        const res = await api.post('/auth/otp/verify', { email, otp });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
    };

    const googleLogin = async (credentialResponse) => {
        const res = await api.post('/auth/google', { googleToken: credentialResponse.credential });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginWithOtp, googleLogin, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
