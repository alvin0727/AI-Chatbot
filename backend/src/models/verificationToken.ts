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
    // Metadata for OTP tokens
    otpMetadata: {
        type: {
            attempts: { type: Number, default: 0 },
            maxAttempts: { type: Number, default: 3 },
            lastAttempt: { type: Date },
            isBlocked: { type: Boolean, default: false },
            blockUntil: { type: Date },
            lastGenerated: { type: Date },
        },
        // Only present if type === 'otp'
        required: function() {
            return this.type === 'otp';
        }
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 }
    }
}, { timestamps: true });

// Index for quick lookups
verificationTokenSchema.index({ userId: 1, type: 1 });
verificationTokenSchema.index({ token: 1 });

export default mongoose.model("VerificationToken", verificationTokenSchema);