import { Router } from "express";
import user from "../controllers/user-controllers.js";
import validators from "../utils/user-validators.js";

const userRoutes = Router();

userRoutes.get("/", user.getAllUsers);

// User Signup Route
userRoutes.post("/signup", validators.validate(validators.signupValidator), user.userSignup);
userRoutes.get("/verify-email", validators.validate(validators.verifyEmailValidator), user.verifyEmail);
userRoutes.post("/resend-verification", validators.validate(validators.resendVerificationValidator), user.resendVerification);

// User Login Route
userRoutes.post("/login", validators.validate(validators.loginValidator), user.userLogin);
userRoutes.post("/verify-login-otp", validators.validate(validators.verifyLoginOTPValidator), user.verifyLoginOTP);
userRoutes.post("/resend-login-otp", validators.validate(validators.resendLoginOTPValidator), user.resendLoginOTP);
export default userRoutes;
