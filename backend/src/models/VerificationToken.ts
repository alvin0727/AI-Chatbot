import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['email_verification', 'password_reset', 'otp'],
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 } // Auto delete expired tokens
    }
}, { timestamps: true });

export default mongoose.model("VerificationToken", verificationTokenSchema);