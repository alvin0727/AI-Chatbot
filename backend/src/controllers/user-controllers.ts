import { Request, Response, NextFunction } from "express";
import User from "../models/User.js"
import VerificationToken from "../models/VerificationToken.js";
import Logger from "../utils/logger.js";
import bcrypt from "bcrypt";
import { generateVerificationToken, sendVerificationEmail } from "../utils/email.js";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get All Users Logic
        const users = await User.find({});
        Logger.info(`Fetched ${users.length} users`);
        return res.status(200).json({
            message: "Users fetched successfully",
            data: users
        });

    } catch (error) {
        Logger.error(`Error fetching users: ${error.message}`);
        return res.status(500).json({ message: `Error fetching users: ${error.message}` });
    }
}

export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            Logger.warn(`User with email ${email} already exists`);
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isVerified: false
        });
        await newUser.save();

        // Create verification token
        const token = generateVerificationToken();
        const verificationToken = new VerificationToken({
            userId: newUser._id,
            token: token,
            type: 'email_verification',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        });

        await verificationToken.save();
        await sendVerificationEmail(email, token);

        Logger.info(`User ${email} signed up successfully`);

        return res.status(201).json({
            message: "User registered successfully. Please check your email to verify your account.",
            id: newUser._id.toString(),
        });

    } catch (error) {
        Logger.error(`Error Signing Up User: ${error.message}`);
        return res.status(500).json({ message: `Error Signing Up User: ${error.message}` });
    }
}

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.query;

        if (!token) {
            Logger.warn("Verification token is required");
            return res.status(400).json({ message: "Verification token is required" });
        }

        // Find and Delete token in one operation (one-time use)
        const verificationToken = await VerificationToken.findOne({
            token: token,
            type: 'email_verification',
            expiresAt: { $gt: new Date() } // Check if token is not expired
        });

        if (!verificationToken) {
            Logger.warn("Invalid, expired, or already used verification token");
            return res.status(400).json({ message: "Invalid, expired, or already used verification token" });
        }

        // Get user by userId
        const user = await User.findById(verificationToken.userId);
        if (!user) {
            Logger.warn("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            Logger.warn("User is already verified");
            await VerificationToken.findByIdAndDelete(verificationToken._id);
            return res.status(400).json({ message: "User is already verified" });
        }

        // Mark user as verified
        user.isVerified = true;
        await user.save();

        // Delete the verification token
        await VerificationToken.findByIdAndDelete(verificationToken._id);

        Logger.info(`Email for user ${user.email} verified successfully`);

        return res.status(200).json({ message: "Email verified successfully" });

    } catch (error) {
        Logger.error(`Error verifying email: ${error.message}`);
        return res.status(500).json({ message: `Error verifying email: ${error.message}` });
    }

}

export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            Logger.warn(`User with email ${email} not found`);
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isVerified) {
            Logger.warn("User is already verified");
            return res.status(400).json({ message: "User is already verified" });
        }

        // Delete any existing verification tokens for this user
        await VerificationToken.deleteMany({
            userId: user._id,
            type: 'email_verification'
        });

        // Create a new verification token
        const token = generateVerificationToken();
        const verificationToken = new VerificationToken({
            userId: user._id,
            token: token,
            type: 'email_verification',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        });

        await verificationToken.save();
        await sendVerificationEmail(email, token);

        Logger.info(`Resent verification email to ${email}`);

        return res.status(200).json({
            message: "Verification email resent successfully. Please check your inbox.",
        });

    } catch (error) {
        Logger.error(`Error resending verification email: ${error.message}`);
        return res.status(500).json({ message: `Error resending verification email: ${error.message}` });
    }
}