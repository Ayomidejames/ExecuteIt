const { relayMail, generateOTP } = require("../lib/mailservices");
const User = require("../schema/userSchema");


//verify user using the otp provided
const otpVerify = async(req, res) => {
    const {otp, email} = req.body
    try {
        //checks for the user in the database
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({msg: 'User not found. Kindly register.'})}
        if (user.isVerified) {
            return res.status(400).json({msg: 'User already verified.'})}
        if (user.otp && user.otp !== otp) {
            return res.status(400).json({msg: 'OTP Invalid'})
        }
        if (user.otpInvalid < Date.now()) {
            return res.status(400).json({msg: 'OTP has expired.'})
        }
        user.otp = undefined
        user.otpInvalid = undefined
        user.verified = true
        await user.save()
        try {
            const mailObj = {
                mailFrom: `ExecuteIt ${process.env.EX_EMAIL}`,
                mailTo: email,
                subject: 'Welcome to ExecuteIt! Your Account is Verified',
                body: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a202c; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 12px; background-color: #ffffff; text-align: center;">
                    <div style="font-size: 50px; margin-bottom: 20px;">✅</div>
                    <h2 style="color: #2d3748; margin-bottom: 10px; font-size: 26px;">Verification Successful!</h2>
                    <p style="font-size: 18px; color: #4a5568;">Welcome to the team, <strong>${user.username}</strong>. Your account is now fully active.</p>
                    <p style="font-size: 16px; color: #718096; margin-bottom: 30px;">
                        You're all set to start building, managing, and executing your projects with ExecuteIt.
                    </p>
                    <div style="margin: 35px 0;">
                        <a href="${process.env.EXECUTEIT_LOGIN_URL || 'https://executeit.com/login'}" 
                        style="background-color: #3182ce; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(49, 130, 206, 0.2);">
                            Go to My Dashboard
                        </a>
                    </div>
                    <p style="font-size: 15px; color: #4a5568; margin-top: 20px;">
                        Need help getting started? Check out our <a href="#" style="color: #3182ce; text-decoration: none;">Quick Start Guide</a>.
                    </p>
                    <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 30px 0;">
                    <p style="font-size: 0.9em; color: #2d3748; font-weight: 600;">
                        Ready to execute,<br/>
                        <span style="color: #3182ce;">The ExecuteIt Team</span> 🚀
                    </p>
                </div>
                `
            }
        relayMail(mailObj)
        }
        catch (error) {console.log(error)}
        return res.status(200).json({msg: 'Your account has been verified. Proceed to login.'})
    } catch (error) {
        return res.status(500).json({msg: error})
    }
}

const otpResend = async(req, res) => {
    const {email} = req.body
    const time = Date.now()
    try {
        const user = await User.findOne({email})
        //checks for the user in the database
        if (!user) {
            return res.status(400).json({msg: 'User not found.'})
        }
        if (user.verified) {
            return res.status(400).json({msg: 'User already verified.'})
        }
        //utilizing rate limiting to reduce the amount of otp generated
        if ((time - user.lastOTPsent) < 60 * 1000) {
            return res.status(400).json({msg: `Please wait for 20 minutes more`})
        }
        const {otp, otpInvalid} = generateOTP()
        user.otp = otp
        user.otpInvalid = otpInvalid
        user.lastOTPsent = time
        await user.save()
        try {
            const mailObj = {
                mailFrom: `ExecuteIt ${process.env.EX_EMAIL}`,
                mailTo: email,
                subject: 'Welcome to ExecuteIt! Your Account is Verified',
                body: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a202c; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 12px; background-color: #ffffff;">
                    <h2 style="color: #2d3748; margin-bottom: 20px; font-size: 24px;">Need a new code?</h2>
                    <p style="font-size: 16px;">Hello <strong>${user.username}</strong>, we received a request for a new verification code for your ExecuteIt account.</p>
                    <p style="font-size: 16px; font-weight: 500;">Your new One-Time Password (OTP) is:</p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <span style="background-color: #fffaf0; color: #dd6b20; padding: 20px 40px; font-size: 32px; font-family: monospace; font-weight: bold; letter-spacing: 6px; border-radius: 10px; border: 2px solid #fbd38d; display: inline-block;">
                            ${otp}
                        </span>
                    </div>
                    <p style="font-size: 15px; color: #4a5568;">
                        This code replaces any previous codes sent to you and will expire in <strong>20 minutes</strong>.
                    </p>
                    <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; margin-top: 25px;">
                        <p style="font-size: 0.85em; color: #718096; margin: 0;">
                            <strong>Pro Tip:</strong> If you don't see the email, check your "Promotions" or "Spam" folder, or add <code>support@executeit.com</code> to your safe senders list.
                        </p>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 30px 0;">
                    <p style="font-size: 0.85em; color: #a0aec0;">
                        If you didn't request a new code, please secure your account by changing your password or contact our security team.
                    </p>
                    <p style="font-size: 0.9em; color: #2d3748; font-weight: 600; margin-top: 25px;">
                        Back to the mission,<br/>
                        <span style="color: #3182ce;">The ExecuteIt Team</span> 🚀
                    </p>
                </div>
                `
            }
        return relayMail(mailObj)
        }
        catch (error) {console.log(error)}
        return res.status(200).json({msg: 'new OTP generated.'})
    } catch (error) {
        return res.status(500).json({msg: error})
    }
}

module.exports = {
    otpVerify,
    otpResend
}