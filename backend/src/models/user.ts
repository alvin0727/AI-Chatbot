import mongoose from "mongoose";
import { randomUUID } from "crypto";

const chatSchema = new mongoose.Schema({
    id: {
        type: String,
        default: randomUUID,
    },
    role: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
});

// Chat Limit Schema
const chatLimitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    dailyCount: {
        type: Number,
        default: 0,
        max: 4
    },
    lastResetDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // TTL 24 hours (86400 seconds)
    }
});

// Index for auto-cleanup based on TTL
chatLimitSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    chats: [chatSchema]
});

// Models
export const ChatLimit = mongoose.model("ChatLimit", chatLimitSchema);
export const User = mongoose.model("User", userSchema);

export default User;