import { Router } from "express";
import { getMeController, login, register, resendEmailController, verifyEmailController } from "../controllers/auth.controller.js";
import { loginValidator, registrationValidator } from "../validators/auth.validator.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register",registrationValidator , register);

/**
 * @route POST /api/auth/resend-email
 */
authRouter.post("/resend-email",resendEmailController)

/**
 * @route POST /api/auth/login
 */
authRouter.post("/login",loginValidator, login)

/**
 * @route GET /api/auth/get-me
 */
authRouter.get("/get-me",verifyToken,getMeController)

/**
 * @route GET /api/auth/verifyEmail/:token
 */
authRouter.get("/verifyEmail",verifyEmailController)

export default authRouter;