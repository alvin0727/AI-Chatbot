import mongoose from "mongoose";
import { randomUUID } from "crypto";


const chatSchema = new mongoose.Schema({
    id: {
        type: String,
        default: randomUUID(),
    },
    role: {
        type: String,
        required: true,
    },
    conten: {
        type: String,
        required: true,
    }
});
const userSchema = new mongoose.Schema({
    Name: {
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    chats: [chatSchema]
});

export default mongoose.model("User", userSchema);