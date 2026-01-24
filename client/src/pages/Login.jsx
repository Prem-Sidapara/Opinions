import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('EMAIL'); // EMAIL or OTP
    const { loginWithOtp, googleLogin } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/auth/otp/send', { email });
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
        <div className="container" style={{ marginTop: '2rem', maxWidth: '400px' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    {step === 'EMAIL' ? 'Login / Sign Up' : 'Enter OTP'}
                </h2>

                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                {step === 'EMAIL' ? (
                    <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Code sent to {email}
                        </p>
                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            className="input"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            required
                        />
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                        <button
                            type="button"
                            className="btn"
                            onClick={() => setStep('EMAIL')}
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Back to Email
                        </button>
                    </form>
                )}

                <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>OR</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                await googleLogin(credentialResponse);
                                navigate('/');
                            } catch (err) {
                                setError('Google Login Failed');
                            }
                        }}
                        onError={() => {
                            setError('Google Login Failed');
                        }}
                        theme="filled_black"
                        shape="pill"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
