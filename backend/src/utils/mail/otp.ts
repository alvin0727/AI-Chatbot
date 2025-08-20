import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { config } from '../../config/config';

export const generateOTP = (): string => {
    return crypto.randomInt(100000, 999999).toString();
};

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: {
            name: 'AI Chatbot - No Reply',
            address: config.EMAIL_USER,
        },
        replyTo: config.NO_REPLY_EMAIL,
        to: email,
        subject: '🔐 Sign In Verification Code - AI Chatbot',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #333; margin: 0;">🤖 AI Chatbot</h1>
                </div>
                
                <h2 style="color: #333;">🔐 Sign In Verification</h2>
                <p>Your verification code for signing in is:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; 
                                border: 2px dashed #007bff; display: inline-block;">
                        <span style="font-size: 32px; font-weight: bold; color: #007bff; 
                                     letter-spacing: 8px;">${otp}</span>
                    </div>
                </div>
                
                <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0; color: #856404; font-size: 14px;">
                        ⚠️ <strong>Security Notice:</strong><br>
                        • This code expires in 5 minutes<br>
                        • You have 3 attempts to enter the correct code<br>
                        • After 3 failed attempts, you'll be blocked for 15 minutes
                    </p>
                </div>
                
                <!-- ✅ No-reply notice -->
                <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0; color: #721c24; font-size: 13px;">
                        📧 <strong>This is an automated message - Please do not reply</strong><br>
                        For support, contact us at: <a href="mailto:support@aichatbot.com" style="color: #007bff;">support@aichatbot.com</a>
                    </p>
                </div>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="color: #dc3545; font-size: 12px; text-align: center;">
                    🚨 If you didn't request this code, please ignore this email and consider changing your password.
                </p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};