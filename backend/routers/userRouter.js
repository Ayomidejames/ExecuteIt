const express = require('express')
const { createUser, getUsers, deleteUser } = require('../controllers/userController')
const adminMiddleware = require('../middlewares/adminMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')
const userRouter = express.Router()

userRouter
    .post('/user/register', createUser)
    .get('/user/getUsers', adminMiddleware, getUsers)
    .delete('/removeUser', authMiddleware, deleteUser)

module.exports = userRouter