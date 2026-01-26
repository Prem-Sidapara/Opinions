const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        // match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Please use a valid @gmail.com address'], // Relaxed validation
        lowercase: true,
    },
    // password: { type: String }, // Removed for OTP-only flow
    otp: {
        type: String,
        select: false // Do not return by default
    },
    otpExpires: {
        type: Date,
        select: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allow null/undefined values to be non-unique (though unique indexes handle partials differently, sparse is safer for optional unique fields)
    },
    username: {
        type: String,
        required: true,
    },
    isSetupComplete: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);
