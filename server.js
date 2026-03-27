const express = require('express')
const server = express()
require('dotenv').config()
const connectDB = require('./db/dbconnection')
const userRouter = require('./routers/userRouter')
const otpRouter = require('./routers/otpRouter')
const authRouter = require('./routers/authRouter')
connectDB()
server.use(express.urlencoded({extended: true}))
port = process.env.PORT

// middlewares that helps us able to send urlencoded and json data to the request body 
server.use(express.json())
server.use('/api', userRouter)
server.use('/api', otpRouter)
server.use('/api', authRouter)
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})