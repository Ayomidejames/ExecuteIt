const express = require('express')
const { SignIn, resetPasswordRequest, validatePassword, resetPassword, Logout } = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')


const authRouter = express.Router()

authRouter
    // User SignIn
    .post('/user/SignIn', SignIn)
    .post('/user/logout', Logout)
    // Password reset
    .post('/password/resetRequest', resetPasswordRequest)
    .post('/password/validate', validatePassword)
    .post('/password/reset', resetPassword)


module.exports = authRouter