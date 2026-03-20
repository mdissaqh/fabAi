import {body, validationResult} from "express-validator"

function validate(req,res,next) {
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
    }
    next()
}



export const registrationValidator=[
    body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({min:3,max:20}).withMessage("Username should be in between 3 to 20")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("No special characters should be used except _ in the username"),
    
    body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Provide valid email"),

    body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({min:6}).withMessage("Password length should atleast 6 characters"),
    validate
]

export const loginValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email"),

    body("password")
        .notEmpty().withMessage("Password is required"),

    validate
];