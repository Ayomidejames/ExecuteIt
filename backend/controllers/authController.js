const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../schema/userSchema')
const { generateOTP, relayMail } = require('../lib/mailservices')


const SignIn = async(req, res) => {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(400).json({
                msg: "Please provide email and password to proceed."
            })
        }
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({
                msg: "User not found. Please proceed to register first."
            })
        }
        if (!user.verified){
            return res.status(403).json({msg: "User not verified."})
        }

            // comparing the password passed into the request body to the password of the user in the database
            const comparedPassword = await bcrypt.compare(password, user.password)
            if (comparedPassword === false) {
                return res.status(404).json({
                    msg: 'email or password incorrect. Try again'
                })
            }
            const getToken = (id) => {
                return jwt.sign(
                    {id},
                    process.env.JWT_SECRET,
                    {expiresIn: "30m"}
                )
            }
            const Token = getToken(user._id)
            return res
                .cookie('token', Token, {httpOnly: true, sameSite: 'strict'})
                .status(200)
                .json({msg: 'Log in successful.'})
        } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    }
}


const resetPasswordRequest = async(req, res) => {
    const { email } = req.body
    try {
        const user = await User.finOne({email})
        if (!user) return res.status(404).json({msg: 'User with email not found. Proceed to register.'})
        const { passwordResetToken, otpInvalid } = generateOTP()
        user.passwordResetToken = passwordResetToken
        user.passwordResetTokenInavlid = otpInvalid
        await user.save()
        try {
            const mailObj = {
                mailFrom: `ExecuteIt ${process.env.EX_EMAIL}`,
                mailTo: email,
                subject: 'ExecuteIt Password Reset',
                body: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a202c; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 12px; background-color: #ffffff;">
    
                    <h2 style="color: #2d3748; margin-bottom: 20px; font-size: 24px;">Reset your password</h2>
                    <p style="font-size: 16px;">Hello <strong>${user.username}</strong>,</p>
                    <p style="font-size: 16px;">We received a request to reset your password. You can do this quickly by clicking the button below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" 
                        style="background-color: #3182ce; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(49, 130, 206, 0.2);">
                            Reset Password
                        </a>
                    </div>
                    <div style="text-align: center; margin-bottom: 30px; padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e0;">
                        <p style="margin-top: 0; font-size: 14px; color: #4a5568;">Or enter this reset token manually on the reset page:</p>
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 20px; font-weight: bold; color: #2d3748; letter-spacing: 2px;">
                            ${passwordResetToken}
                        </span>
                    </div>
                    <p style="font-size: 14px; color: #718096;">
                        <strong style="color: #e53e3e;">Security Note:</strong> This request will expire in 1 hour. If you did not request this, your password will remain unchanged and you can safely ignore this email.
                    </p>
                    <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 30px 0;">
                    <p style="font-size: 0.9em; color: #2d3748; font-weight: 600; margin-top: 25px;">
                        Stay secure,<br/>
                        <span style="color: #3182ce;">The ExecuteIt Team</span> 🚀
                    </p>
                </div>
                `
            }
        relayMail(mailObj)
        }
        catch (error) {console.log(error)}
        res.status(200).json({msg: 'Your password reset token has been sent.'})        
    } catch (error) {
        console.log(error)
    }
}

const validatePassword = async(req, res) => {
    const {token, email} = req.body
    try {
        const user = await User.finOne({email})
        if (!user) return res.status(404).json({msg: 'User with email not found. Proceed to register.'})
        if (user.passwordResetToken !== token && user.passwordResetTokenInavlid < Date.now()) return res.status(400).json({msg: 'Invalid token'})
        return res.status(200).json({msg: 'Access granted, proceed to change password.'})
    } catch (error) {
        console.log(error)
    }
}

const resetPassword = async(req, res) => {
    const {token, newPassword} = req.body
    try {
        const user = await User.findOne({passwordResetToken: token})
        if (!user) return res.status(404).json({msg: 'User with email not found. Proceed to register.'})
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()
        try {
            const mailObj = {
                mailFrom: `ExecuteIt ${process.env.EX_EMAIL}`,
                mailTo: email,
                subject: 'ExecuteIt Password Reset',
                body: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a202c; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 12px; background-color: #ffffff; text-align: center;">
    
                    <div style="font-size: 50px; margin-bottom: 20px;">🛡️</div>
                    
                    <h2 style="color: #2d3748; margin-bottom: 10px; font-size: 24px;">Password Updated Successfully</h2>
                    
                    <p style="font-size: 16px; color: #4a5568;">Hello <strong>${user.username}</strong>,</p>
                    
                    <p style="font-size: 16px; color: #4a5568;">
                        This is a confirmation that the password for your ExecuteIt account was recently changed. You can now use your new password to log in.
                    </p>
                    
                    <div style="margin: 35px 0;">
                        <a href="${process.env.EXECUTEIT_LOGIN_URL || 'https://executeit.com/login'}" 
                        style="background-color: #3182ce; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(49, 130, 206, 0.2);">
                            Log In to Your Account
                        </a>
                    </div>
                    
                    <div style="background-color: #fff5f5; border: 1px solid #feb2b2; padding: 20px; border-radius: 8px; text-align: left; margin-top: 30px;">
                        <p style="margin: 0; font-size: 14px; color: #c53030; font-weight: bold;">Did you not make this change?</p>
                        <p style="margin: 10px 0 0 0; font-size: 13px; color: #742a2a;">
                            If you did not reset your password, please **contact our security team immediately** or click the link below to temporarily disable your account while we investigate.
                        </p>
                        <a href="${securityLink}" style="display: inline-block; margin-top: 10px; font-size: 13px; color: #c53030; text-decoration: underline; font-weight: 600;">
                            Secure my account now
                        </a>
                    </div>
                    
                    <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 30px 0;">
                    
                    <p style="font-size: 0.9em; color: #2d3748; font-weight: 600;">
                        Stay safe,<br/>
                        <span style="color: #3182ce;">The ExecuteIt Security Team</span> 🚀
                    </p>
                </div>
                `
            }
        relayMail(mailObj)
        }
        catch (error) {console.log(error)}
        return res.status(200).json({msg: 'Password changed successfully. Proceed to login.'})
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    SignIn,
    resetPasswordRequest,
    validatePassword,
    resetPassword
}