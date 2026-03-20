import jwt from "jsonwebtoken"


export function verifyToken(req,res,next) {
    const {token}=req.cookies
    if(!token){
        return res.status(401).json({
            message:"Token not found",
            success:false,
            err:"Please login first"
        })
    }
    let decoded
    try{
        decoded=jwt.verify(token,process.env.JWT_SECRET)
    }
    catch{
        return res.status(404).json({
            message:"Token is invalid",
            success:false,
            err:"Token expired or invalid"
        })
    }
    req.user=decoded
    next()
}