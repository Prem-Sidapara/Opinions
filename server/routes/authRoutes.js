const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const auth = require('../middleware/auth');

router.post('/otp/send', authController.sendOtp);
router.post('/otp/verify', authController.verifyOtp);
router.post('/google', authController.googleLogin);
router.get('/user', auth, authController.getUser);

module.exports = router;
