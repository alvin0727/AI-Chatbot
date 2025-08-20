import { Router } from "express";
import user from "../controllers/user-controllers";
import validators from "../utils/validators/user-validators";
import { authenticate } from "../middleware/auth-middleware";

const userRoutes = Router();

userRoutes.get("/", user.getAllUsers);

// User Signup Route
userRoutes.post("/signup", validators.validate(validators.signupValidator), user.userSignup);
userRoutes.post("/verify-email", validators.validate(validators.verifyEmailValidator), user.verifyEmail);
userRoutes.post("/resend-verification", validators.validate(validators.resendVerificationValidator), user.resendVerification);

// User Login Route
userRoutes.post("/login", validators.validate(validators.loginValidator), user.userLogin);
userRoutes.post("/verify-login-otp", validators.validate(validators.verifyLoginOTPValidator), user.verifyLoginOTP);
userRoutes.post("/resend-login-otp", validators.validate(validators.resendLoginOTPValidator), user.resendLoginOTP);

// Cookies
userRoutes.get("/auth-status", authenticate, user.verifyUser);
userRoutes.post("/refresh-token", user.refreshAccessToken);
userRoutes.post("/logout", user.logout);

export default userRoutes;
