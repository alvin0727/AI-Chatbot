import { Request, Response, NextFunction } from "express";
import User from "../models/user.js"
import VerificationToken from "../models/verificationToken.js";
import Logger from "../utils/logger.js";
import bcrypt from "bcrypt";
import { generateVerificationToken, sendVerificationEmail } from "../utils/mail/email.js";
import { generateOTP, sendOTPEmail } from "../utils/mail/otp.js";
import { createToken, createRefreshToken, verifyRefreshToken } from "../utils/token-manager.js";
import { config } from "../config/config.js"

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
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

const userSignup = async (req: Request, res: Response, next: NextFunction) => {
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
        });

    } catch (error) {
        Logger.error(`Error Signing Up User: ${error.message}`);
        return res.status(500).json({ message: `Error Signing Up User: ${error.message}` });
    }
}

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
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

const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
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

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            Logger.warn(`User with email ${email} not found`);
            return res.status(404).json({ message: "User not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            Logger.warn("Invalid password");
            return res.status(401).json({ message: "Invalid password" });
        }

        // Check if user is currently blocked from OTP requests
        const existingOTPToken = await VerificationToken.findOne({
            userId: user._id,
            type: 'otp',
            'otpMetadata.isBlocked': true,
            'otpMetadata.blockUntil': { $gt: new Date() }
        });

        if (existingOTPToken) {
            const blockTimeLeft = Math.ceil((existingOTPToken.otpMetadata.blockUntil.getTime() - Date.now()) / (1000 * 60));
            return res.status(429).json({
                message: `Too many failed attempts. Please try again in ${blockTimeLeft} minutes.`,
                blockTimeLeft: blockTimeLeft
            });
        }

        // Check if there's an existing OTP token for this user
        const existingToken = await VerificationToken.findOne({
            userId: user._id,
            type: 'otp'
        });

        // Generate new OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

        if (existingToken) {
            // Update existing token with new OTP and expiry, preserve metadata
            existingToken.token = otp;
            await existingToken.save();
        } else {
            // Create new OTP token with rate limiting metadata
            const otpToken = new VerificationToken({
                userId: user._id,
                token: otp,
                type: 'otp',
                otpMetadata: {
                    attempts: 0,
                    maxAttempts: 3,
                    lastAttempt: null,
                    isBlocked: false,
                    blockUntil: null,
                },
                expiresAt: otpExpires
            });
            await otpToken.save();
        }

        await sendOTPEmail(email, otp);

        Logger.info(`Login OTP sent to ${email}`);

        return res.status(200).json({
            message: "OTP sent to your email. Please verify to complete sign in.",
            data: {
                name: user.name,
                requiresOTP: true,
                email: email,
                expiresIn: 5, // minutes
                maxAttempts: 3
            }
        });

    } catch (error) {
        Logger.error(`Error logging in user: ${error.message}`);
        return res.status(500).json({ message: `Error logging in user: ${error.message}` });
    }
}

const verifyLoginOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            Logger.warn(`User with email ${email} not found`);
            return res.status(404).json({ message: "User not found" });
        }

        // Find the OTP token
        const otpToken = await VerificationToken.findOne({
            userId: user._id,
            type: 'otp',
            expiresAt: { $gt: new Date() } // Check if OTP is not expired
        });

        if (!otpToken) {
            Logger.warn(`Invalid or expired OTP for user ${email}`);
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Check if user is blocked from OTP requests
        if (otpToken.otpMetadata.isBlocked && otpToken.otpMetadata.blockUntil > new Date()) {
            const blockTimeLeft = Math.ceil((otpToken.otpMetadata.blockUntil.getTime() - Date.now()) / (1000 * 60));
            return res.status(429).json({
                message: `Too many failed attempts. Please try again in ${blockTimeLeft} minutes.`,
                blockTimeLeft: blockTimeLeft
            });
        }

        // Check OTP
        if (otpToken.token !== otp) {
            // Increment attempts
            otpToken.otpMetadata.attempts += 1;
            otpToken.otpMetadata.lastAttempt = new Date();

            // Check if max attempts reached
            if (otpToken.otpMetadata.attempts >= otpToken.otpMetadata.maxAttempts) {
                const blockUntil = new Date(Date.now() + 15 * 60 * 1000); // Block for 15 minutes
                otpToken.otpMetadata.isBlocked = true;
                otpToken.otpMetadata.blockUntil = blockUntil;

                // Update expiresAt to extend so the token is not deleted immediately
                otpToken.expiresAt = blockUntil;
                await otpToken.save();

                Logger.warn(`User ${email} blocked from OTP requests due to too many failed attempts. Blocked until ${otpToken.otpMetadata.blockUntil}`);

                return res.status(429).json({
                    message: `Too many failed attempts. Please try again in 15 minutes.`,
                    blockTimeLeft: 15,
                    attemptsLeft: 0
                });
            }
            await otpToken.save();

            const attemptsLeft = otpToken.otpMetadata.maxAttempts - otpToken.otpMetadata.attempts;
            Logger.warn(`Invalid OTP for user ${email}. Attempts left: ${attemptsLeft}`);

            return res.status(400).json({
                message: `Invalid OTP. You have ${attemptsLeft} attempts left.`,
                attemptsLeft: attemptsLeft
            });
        }

        // OTP is valid - complete login
        await VerificationToken.findByIdAndDelete(otpToken._id); // Delete OTP token after successful verification

        res.clearCookie('authToken', {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            signed: true,
            sameSite: 'lax',
            path: "/"
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            signed: true,
            sameSite: 'lax',
            path: "/"
        });

        const token = createToken(user._id.toString(), user.email, user.isVerified);
        const refreshToken = createRefreshToken(user._id.toString(), user.email);

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000,
            signed: true,
            sameSite: 'lax',
            path: "/"
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (match refresh token expiry)
            signed: true,
            sameSite: 'lax',
            path: "/"
        });

        Logger.info(`User ${email} signed in successfully with OTP`);

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        })

    } catch (error) {
        Logger.error(`Error verifying login OTP: ${error.message}`);
        return res.status(500).json({ message: `Error verifying login OTP: ${error.message}` });
    }
}

const resendLoginOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            Logger.warn(`User with email ${email} not found`);
            return res.status(404).json({ message: "User not found" });
        }

        // Check for active block
        const existingOTPToken = await VerificationToken.findOne({
            userId: user._id,
            type: 'otp',
            'otpMetadata.isBlocked': true,
            'otpMetadata.blockUntil': { $gt: new Date() }
        });

        if (existingOTPToken) {
            const blockTimeLeft = Math.ceil((existingOTPToken.otpMetadata.blockUntil.getTime() - Date.now()) / (1000 * 60));
            return res.status(429).json({
                message: `Too many failed attempts. Please try again in ${blockTimeLeft} minutes.`,
                blockTimeLeft: blockTimeLeft
            });
        }

        // Check if there's an existing OTP token for this user
        const existingToken = await VerificationToken.findOne({
            userId: user._id,
            type: 'otp'
        });

        // Rate limit: Check if user has requested OTP in the last 1 minute
        if (existingToken && existingToken.otpMetadata && existingToken.otpMetadata.lastGenerated) {
            const timeSinceLastOTP = Date.now() - existingToken.otpMetadata.lastGenerated.getTime();
            const oneMinuteInMs = 60 * 1000;

            if (timeSinceLastOTP < oneMinuteInMs) {
                const waitTime = Math.ceil((oneMinuteInMs - timeSinceLastOTP) / 1000);
                Logger.warn(`User ${email} exceeded resend rate limit`);
                return res.status(429).json({
                    message: `Please wait ${waitTime} seconds before requesting a new OTP.`,
                    waitTime: waitTime
                });
            }
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

        if (existingToken) {
            // Update existing token with new OTP and expiry, preserve metadata but update lastGenerated
            existingToken.token = otp;
            if (!existingToken.otpMetadata) {
                existingToken.otpMetadata = {
                    attempts: 0,
                    maxAttempts: 3,
                    lastAttempt: null,
                    isBlocked: false,
                    blockUntil: null,
                };
            }
            existingToken.otpMetadata.lastGenerated = new Date();
            await existingToken.save();
        } else {
            // Create new OTP token with rate limiting metadata
            const otpToken = new VerificationToken({
                userId: user._id,
                token: otp,
                type: 'otp',
                otpMetadata: {
                    attempts: 0,
                    maxAttempts: 3,
                    lastAttempt: null,
                    isBlocked: false,
                    blockUntil: null,
                    lastGenerated: new Date(),
                },
                expiresAt: otpExpires
            });
            await otpToken.save();
        }

        await sendOTPEmail(email, otp);

        Logger.info(`Login OTP resent to ${email}`);

        return res.status(200).json({
            message: "New OTP sent successfully",
            expiresIn: 5,
            maxAttempts: 3
        });

    } catch (error) {
        Logger.error(`Error resending login OTP: ${error.message}`);
        return res.status(500).json({ message: `Error resending login OTP: ${error.message}` });
    }
}

const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Read refresh token from cookie
        const refreshToken = req.signedCookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token not found" });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            // Clear invalid refresh token cookie
            res.clearCookie('refreshToken');
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Get user data
        const user = await User.findById(decoded.id);
        if (!user) {
            res.clearCookie('refreshToken');
            return res.status(404).json({ message: "User not found" });
        }

        // Generate new tokens
        const newAccessToken = createToken(user._id.toString(), user.email, user.isVerified);
        const newRefreshToken = createRefreshToken(user._id.toString(), user.email); // Token rotation

        // Update both cookies
        res.cookie('authToken', newAccessToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000, // 60 minutes
            signed: true,
            sameSite: 'lax',
            path: "/"
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            signed: true,
            sameSite: 'lax',
            path: "/"
        });

        Logger.info(`Tokens refreshed for user ${user.email}`);

        return res.status(200).json({
            message: "Tokens refreshed successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        Logger.error(`Error refreshing token: ${error.message}`);
        return res.status(500).json({ message: "Error refreshing token" });
    }
};

const logout = async (req: Request, res: Response) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        signed: true,
        sameSite: 'lax',
        path: "/"
    });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        signed: true,
        sameSite: 'lax',
        path: "/"
    });

    Logger.info("User logged out successfully");

    return res.status(200).json({ message: "Logged out successfully" });
};


export default {
    getAllUsers,
    userSignup,
    verifyEmail,
    resendVerification,
    userLogin,
    verifyLoginOTP,
    resendLoginOTP,
    refreshAccessToken,
    logout
};