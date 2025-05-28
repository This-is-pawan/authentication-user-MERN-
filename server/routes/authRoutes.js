const express = require('express');
const { register, login, logout, sendVeriyOtp, verifyEmail, isAuthenticated, sendReseOtp, resetPassword } = require('../controller/authController');
const { userAuth } = require('../middlware/userAuth');

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth,sendVeriyOtp);
authRouter.post('/verify-account', userAuth,verifyEmail);
authRouter.get('/is-auth', userAuth,isAuthenticated);//cookie have token
authRouter.post('/send-reset-otp',sendReseOtp );
authRouter.post('/reset-password',resetPassword );

module.exports = authRouter;
