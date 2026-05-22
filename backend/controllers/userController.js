const { generateOTP, relayMail } = require("../lib/mailservices")
const User = require("../schema/userSchema")
const bcrypt = require('bcrypt')

const createUser = async(req, res) => {
    try{
        const { username, email, password, adminRegistrationKey} = req.body
        if ( !username || !email || !password) {
            res.status(400).json({msg: 'Enter all fields to register.'})
        }
        // checks if the incoming email matches one in the db
        const existingUser = await User.findOne({email})
        if (existingUser) res.status(400).json({msg: 'User already exists in db.'})
        const hashedPassword = await bcrypt.hash(password, 10)
        let assignedRole = 'user'
        // to register as an admin, user must input the exact adminRegistrationKey
        if (adminRegistrationKey && adminRegistrationKey === process.env.ADMIN_REGISTRATION_KEY) {
            assignedRole = 'admin'
        }
        // generate otp and send to user email
        const {otp, otpInvalid} = generateOTP()
        const newUser = new User({
            ...req.body, password: hashedPassword, otp, otpInvalid, role: assignedRole
        })
        await newUser.save()
        try {
            const mailObj = {
                mailFrom: `ExecuteIt ${process.env.EX_EMAIL}`,
                mailTo: email,
                subject: 'ExecuteIt - Your OTP Verification Code',
                body:`
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a202c; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 12px; background-color: #ffffff;">
        
                    <h2 style="color: #2d3748; margin-bottom: 20px; font-size: 24px;">Welcome to <span style="color: #3182ce;">ExecuteIt</span>, <strong>${username}</strong>!</h2>
                    
                    <p style="font-size: 16px;">We're excited to have you on board. To get started and secure your account, please verify your email address.</p>
                    
                    <p style="font-size: 16px; font-weight: 500;">Your One-Time Password (OTP) is:</p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <span style="background-color: #ebf8ff; color: #2b6cb0; padding: 20px 40px; font-size: 32px; font-family: monospace; font-weight: bold; letter-spacing: 6px; border-radius: 10px; border: 2px solid #bee3f8; display: inline-block;">
                            ${otp}
                        </span>
                    </div>
                    
                    <p style="font-size: 15px; color: #4a5568;">
                        Enter this code on the verification page to complete your registration. 
                        <br>
                        <strong style="color: #e53e3e;">Note:</strong> This code is valid for <strong>20 minutes</strong>.
                    </p>
                    
                    <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 30px 0;">
                    
                    <p style="font-size: 0.85em; color: #a0aec0; margin-top: 20px;">
                        If you didn't create an account with ExecuteIt, you can safely ignore this email. Someone may have entered your email address by mistake.
                    </p>
                    
                    <p style="font-size: 0.9em; color: #2d3748; font-weight: 600; margin-top: 25px;">
                        Let's get things done,<br/>
                        <span style="color: #3182ce;">The ExecuteIt Team</span> 🚀
                    </p>
                </div>
            `
        }
        const info = relayMail(mailObj)
        console.log(info)
        }
        catch (error) {
            console.log(error)
        }
        return res.status(201).json(newUser)
    } catch(error) {
        res.status(500).json({msg: error.message})
    }
}

const getUsers = async(req, res) => {
    try {
        const users = await User.find()
        if(!users) return res.status(404).json({msg: 'No user found'})
        return res.status(200).json(users)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

const deleteUser = async(req, res) => {
    try {
        const user = req.user
        const oneUser = await User.findOne({_id: user._id})
        if(!oneUser) return res.status(404).json({msg: 'No user found'})
        await oneUser.deleteOne()
        return res.status(200).json({msg: 'user deleted successfully'})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

module.exports = {
    createUser,
    getUsers,
    deleteUser
}