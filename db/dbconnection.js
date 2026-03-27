const mongoose = require('mongoose')
const connectDB = async () => {
    try {
        console.log('connecting to db')
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('connected to db')
    } catch (error) {
        console.log(error)
    }
}
module.exports = connectDB