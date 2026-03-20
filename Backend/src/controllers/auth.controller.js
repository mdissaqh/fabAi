import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";


export async function register(req, res) {

    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ email }, { username }]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with this email or username already exists",
            success: false,
            err: "User already exists"
        })
    }

    const user = await userModel.create({ username, email, password })
    const token = jwt.sign({
        email: user.email
    }, process.env.JWT_SECRET,
        { expiresIn: "10d" }
    )

    await sendEmail({
        to: email,
        subject: "Verify your account - Perplexity",
        html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
            <p>Hi <strong>${username}</strong>,</p>
            <p>Welcome to <strong>Perplexity!</strong> To get started, please confirm your email address by clicking the button below:</p>
            <p>
                <a href="http://localhost:3000/api/auth/verifyEmail?token=${token}" 
                   style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                   Verify My Account
                </a>
            </p>
            <hr />
            <p style="font-size: 0.8em; color: #555;">If you did not sign up for this account, you can safely ignore this email.</p>
        </div>
    `
    });

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });



}

export async function login(req, res) {
    const { username, email, password } = req.body
    const user = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    })
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Password is invalid",
            success: false,
            err: "Password is invalid"
        })
    }
    if (!user.verified) {
        return res.status(400).json({
            message: "Email is not verified",
            success: false,
            err: "Email is not verified"
        })
    }
    const token = jwt.sign({
        id:user._id,
        email: user.email
    }, process.env.JWT_SECRET, {
        expiresIn: "10d"
    })
    res.cookie("token", token)
    res.status(200).json({
        message: "User Logged in successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export async function getMeController(req, res) {
    const { email } = req.user
    const user = await userModel.findOne({ email }).select("-password")
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }
    res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user
    })
}


export async function resendEmailController(req,res) {
    const {email,username}=req.body
    const user=await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })
    if(!user){
        return res.status(404).json({
            message:"User not found in database",
            success:false,
            err:"User doesn't exist"
        })
    }
    if(user.verified){
        return res.status(200).json({
            message:"User already verified",
            success:false,
            err:"User already verified"
        })
    }
    const now=Date.now()
    const minWaitingTime=60*1000
    if(user.lastEmailVerificationTime && (now-user.lastEmailVerificationTime)<minWaitingTime){
        const timeLeft=Math.ceil((minWaitingTime-(now-user.lastEmailVerificationTime))/1000)
        return res.status(429).json(
            {
                message:`Please wait for ${timeLeft}s Before requesting resend email`,
                success:false
            }
        )
    }
    const token=jwt.sign({
        email:user.email
    },process.env.JWT_SECRET,{
        expiresIn:"10d"
    })
    await sendEmail({
    to: user.email,
    subject: "Resend: Verify your account - Perplexity",
    html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
            <p>Hi <strong>${user.username}</strong>,</p>
            <p>You requested a new verification link for your <strong>Perplexity</strong> account. Please click the button below to activate your account:</p>
            <p>
                <a href="http://localhost:3000/api/auth/verifyemail?token=${token}" 
                   style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                   Verify My Account
                </a>
            </p>
            <p style="font-size: 0.9em; color: #777;">This link will expire in 10 days.</p>
            <hr />
            <p style="font-size: 0.8em; color: #555;">If you didn't request this, you can ignore this email.</p>
        </div>
    `
});
    user.lastEmailVerificationTime=now
    await user.save()
    res.status(200).json({
        message:"Verification Email resent successfully",
        success:true
    })
}

export async function verifyEmailController(req, res) {
    const { token } = req.query
    console.log(token)
    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
        const { email } = decoded
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                err: "User not found"
            })
        }
        if (user.verified) {
        return res.send(`
        <div style="text-align: center; padding: 50px; font-family: sans-serif;">
            <h1 style="color: #17a2b8;">Already Verified!</h1>
            <p>Your account is already verified and active.</p>
            <p>You can proceed to log in using the link below.</p>
            <br />
            <a href="http://localhost:3000/api/auth/login" 
               style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
               Click here to Login
            </a>
        </div>
    `);
        }
        user.verified = true
        await user.save()
    } catch (err) {
        return res.status(400).json({
            message: "Token is invalid or expired",
            success: false,
            err: err.message
        })
    }
    res.send(`
    <div style="text-align: center; padding: 50px; font-family: sans-serif;">
        <h1 style="color: #28a745;">Email Verified!</h1>
        <p>Your account has been successfully activated.</p>
        <br />
        <a href="http://localhost:3000/api/auth/login" 
           style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
           Click here to Login
        </a>
    </div>
`);
}