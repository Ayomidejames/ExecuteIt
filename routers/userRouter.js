const express = require('express')
const { createUser } = require('../controllers/userController')
const userRouter = express.Router()

userRouter
    .post('/user/register', createUser)

module.exports = userRouter