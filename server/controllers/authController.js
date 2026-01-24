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
            from: process.env.EMAIL_USER || 'noreply@opinions.com',
            to: email,
            subject: 'Your Login OTP',
            text: `Your OTP is: ${otp}`
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            console.log(`OTP sent to ${email} via Gmail`);
        } else {
            console.warn('WARNING: No EMAIL_USER/PASS provided. OTP logged to console only.');
            console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
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
