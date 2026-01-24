const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/otp/send', authController.sendOtp);
router.post('/otp/verify', authController.verifyOtp);
router.post('/google', authController.googleLogin);

module.exports = router;
