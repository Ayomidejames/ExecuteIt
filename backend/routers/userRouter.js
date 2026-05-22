const express = require('express')
const { createUser, getUsers, deleteUser, getUserProfile } = require('../controllers/userController')
const adminMiddleware = require('../middlewares/adminMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')
const userRouter = express.Router()

userRouter
    .post('/user/register', createUser)
    .get('/user/getUsers', adminMiddleware, getUsers)
    .delete('/removeUser', authMiddleware, deleteUser)
    .get('/user/profile', authMiddleware, getUserProfile)

module.exports = userRouter