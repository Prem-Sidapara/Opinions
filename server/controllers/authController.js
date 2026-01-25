const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Login
exports.googleLogin = async (req, res) => {
    try {
        const { googleToken } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email, name, sub, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            // If user exists but doesn't have googleId linked
            if (!user.googleId) {
                user.googleId = sub;
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                username: name,
                email,
                googleId: sub,
                isSetupComplete: true,
                // password is not required
            });
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email, picture } });

    } catch (err) {
        console.error("Google Auth Error:", err);
        res.status(500).json({ error: 'Google Authentication Failed' });
    }
};

const nodemailer = require('nodemailer');

// Configure Nodemailer (Use environment variables for credentials)
// For "Zero Money" implementation:
// 1. Use Gmail App Password (free)
// 2. Or just log to console for dev if no credentials provided
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Upsert user (Create if not exists, or update)
        // We don't require a username upfront for OTP flow, can generate a placeholder
        // But to keep it simple, we'll try to find existing or create new with placeholder

        let user = await User.findOne({ email });
        if (!user) {
            // Create user placeholder
            user = new User({
                email,
                username: email.split('@')[0], // Default username
                isSetupComplete: false
            });
        }

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send Email
        const mailOptions = {
            from: `"Opinions Security" <${process.env.EMAIL_USER}>`,
            to: email,
            replyTo: process.env.EMAIL_USER,
            sender: process.env.EMAIL_USER,
            subject: 'Opinions Login Verification Code', // More distinct subject
            text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 480px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; }
                    .header { text-align: center; margin-bottom: 24px; }
                    .otp-box { background: #f9f9f9; border-radius: 6px; padding: 16px; text-align: center; margin: 24px 0; letter-spacing: 6px; font-size: 28px; font-weight: 700; border: 1px solid #ddd; }
                    .footer { font-size: 12px; color: #888; text-align: center; margin-top: 32px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Login Verification</h2>
                    </div>
                    <p>Hello,</p>
                    <p>Please use the verification code below to sign in. This code is valid for 10 minutes.</p>
                    
                    <div class="otp-box">${otp}</div>

                    <p>If you didn't request this, purely ignore this email.</p>
                    
                    <div class="footer">
                        Sent securely by Opinions App
                    </div>
                </div>
            </body>
            </html>
            `
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                await transporter.sendMail(mailOptions);
                console.log(`OTP sent via Gmail`);
            } catch (emailErr) {
                console.error("Email sending failed:", emailErr);
                return res.status(500).json({ error: 'Failed to send OTP email' });
            }
        } else {
            // If credentials are missing, we should probably fail or warn securely, but DEFINITELY DO NOT LOG OTP
            console.error("Server Error: Missing Email Credentials for OTP");
            return res.status(500).json({ error: 'Server configuration error: Email not set up' });
        }

        res.json({ message: 'OTP sent successfully' });

    } catch (err) {
        console.error("Email Error:", err);
        // Specifically catch auth errors to hint the user
        if (err.code === 'EAUTH') {
            return res.status(500).json({ error: 'Failed to send email. Check server EMAIL_USER/PASS credentials.' });
        }
        res.status(500).json({ error: 'Failed to send OTP' });
    }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find user with matching email and OTP, and ensure OTP hasn't expired
        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() }
        }).select('+otp +otpExpires');

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;
        user.isSetupComplete = true; // Mark as verified
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'OTP Verification failed' });
    }
};

// Get User
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};
