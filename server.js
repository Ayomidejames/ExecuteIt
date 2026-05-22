const express = require('express')
const server = express()
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./backend/db/dbconnection')
const userRouter = require('./backend/routers/userRouter')
const otpRouter = require('./backend/routers/otpRouter')
const authRouter = require('./backend/routers/authRouter')
const taskRouter = require('./backend/routers/taskRouter')
connectDB()

port = process.env.PORT

// middlewares that helps us able to send urlencoded and json data to the request body
server.use(cookieParser())
server.use(express.json())
server.use(express.urlencoded({extended: true}))

server.use('/api', userRouter)
server.use('/api', otpRouter)
server.use('/api', authRouter)
server.use('/api', taskRouter)
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})