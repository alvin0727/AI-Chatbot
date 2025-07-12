import nodemailer from 'nodemailer';
import crypto from 'crypto';
import {config} from "../config/config.js";

export const generateVerificationToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASS,
        },
    });

    const verificationLink = `${config.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: config.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email Address',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Welcome! Please verify your email</h2>
                <p>Thank you for signing up. Please click the button below to verify your email address:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationLink}" 
                       style="background-color: #007bff; color: white; padding: 15px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Verify Email Address
                    </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                    If the button doesn't work, copy and paste this link in your browser:<br>
                    <a href="${verificationLink}">${verificationLink}</a>
                </p>
                <p style="color: #666; font-size: 12px;">
                    This link will expire in 24 hours.
                </p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};