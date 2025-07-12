import { Router } from "express";
import { getAllUsers, userSignup, verifyEmail, resendVerification } from "../controllers/user-controllers.js";

const userRoutes = Router();

userRoutes.get("/", getAllUsers);
userRoutes.post("/signup", userSignup);
userRoutes.get("/verify-email", verifyEmail);
userRoutes.post("/resend-verification", resendVerification);

export default userRoutes;
