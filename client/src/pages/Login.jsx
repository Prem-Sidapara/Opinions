import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../utils/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('EMAIL'); // EMAIL or OTP
    const { loginWithOtp, googleLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isRegister = location.pathname === '/register';
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/otp/send', { email });
            setStep('OTP');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await loginWithOtp(email, otp);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '440px' }}>
                <div className="text-center mb-6">
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                        {step === 'EMAIL'
                            ? (isRegister ? 'Join Opinions' : 'Welcome Back')
                            : 'Verify Access (Debug Mode)'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        {step === 'EMAIL'
                            ? (isRegister ? 'Create an account to start sharing' : 'Enter your email to continue to Opinions')
                            : (
                                <>
                                    We sent a code to {email}.
                                    <br />
                                    <span style={{ fontSize: '1em', color: 'var(--text-muted)' }}>
                                        (I am using free Gmail tier, so it may take ~5-7 mins to arrive!)
                                    </span>
                                </>
                            )}
                    </p>
                </div>

                {error && (
                    <div className="animate-fade-in" style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#fca5a5',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {step === 'EMAIL' ? (
                    <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                                    Sending Code...
                                </span>
                            ) : 'Send OTP on Email'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="X X X X X X"
                                className="input"
                                style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.2rem' }}
                                value={otp}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    if (val.length <= 6) setOtp(val);
                                }}
                                maxLength={6}
                                required
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify Login'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-ghost w-full"
                            onClick={() => {
                                setStep('EMAIL');
                                setError('');
                                setOtp('');
                            }}
                        >
                            Change Email
                        </button>
                    </form>
                )}

                <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
                    <div style={{ height: '1px', flex: 1, background: 'var(--border)' }}></div>
                    <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or continue with</span>
                    <div style={{ height: '1px', flex: 1, background: 'var(--border)' }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                setLoading(true); // Manually set loading while processing
                                await googleLogin(credentialResponse);
                                navigate('/');
                            } catch (err) {
                                console.error("Login Error: ", err);
                                // Construct a detailed debug message
                                let debugMsg = "Debug Info: ";
                                if (err.response) {
                                    debugMsg += `Status: ${err.response.status}, Data: ${JSON.stringify(err.response.data)}`;
                                } else if (err.request) {
                                    debugMsg += "No response received (Network Error?)";
                                } else {
                                    debugMsg += err.message;
                                }
                                setError(debugMsg);
                            } finally {
                                setLoading(false);
                            }
                        }}
                        onError={() => {
                            setError('Google Login Failed');
                        }}
                        theme="filled_black"
                        shape="pill"
                        width="300"
                    />
                </div>

                <style>{`
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        </div>
    );
};

export default Login;
