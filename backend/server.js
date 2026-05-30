const express = require('express')
const cors = require('cors')
const server = express()
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./db/dbconnection')
const userRouter = require('./routers/userRouter')
const otpRouter = require('./routers/otpRouter')
const authRouter = require('./routers/authRouter')
const taskRouter = require('./routers/taskRouter')
const quoteRouter = require('./routers/quoteRouter')
connectDB()

port = process.env.PORT

// middlewares
server.use(cors({
    origin: ['http://localhost:5173', 'https://execute-it-roan.vercel.app'],
    credentials: true
}))
server.use(cookieParser())
server.use(express.json())
server.use(express.urlencoded({extended: true}))

server.use('/api', userRouter)
server.use('/api', otpRouter)
server.use('/api', authRouter)
server.use('/api', taskRouter)
server.use('/api', quoteRouter)
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})