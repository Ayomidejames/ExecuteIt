const mongoose = require("mongoose")
// defining the user schema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String
    },
    otpInvalid: {
        type: String
    },
    verified: {
        type: Boolean
    },
    lastOTPsent: Date,
    passwordResetToken: String,
    passwordResetTokenInvalid: String,
    role: {
        type: String,
        enum : ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true })

// tasks should be independent of individuals
const User = mongoose.model('User', userSchema)
module.exports = User