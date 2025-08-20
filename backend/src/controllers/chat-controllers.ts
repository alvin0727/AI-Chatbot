import { Request, Response, NextFunction } from "express";
import User, { ChatLimit } from "../models/user";
import configAI from "../config/openai-config.js";
import { ChatCompletionUserMessageParam } from "openai/resources/chat/completions";
import Logger from "../utils/logger.js";

// Helper function to check if date is today
const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
};

// Helper function to check and update chat limit
const checkChatLimit = async (userId: string): Promise<{ canChat: boolean; remainingChats: number }> => {
    try {
        let chatLimit = await ChatLimit.findOne({ userId });
        
        if (!chatLimit) {
            // Create new chat limit record
            chatLimit = new ChatLimit({
                userId,
                dailyCount: 0,
                lastResetDate: new Date()
            });
            await chatLimit.save();
        }

        // Check if we need to reset daily count (new day)
        if (!isToday(chatLimit.lastResetDate)) {
            chatLimit.dailyCount = 0;
            chatLimit.lastResetDate = new Date();
            await chatLimit.save();
        }

        const maxDailyChats = 4;
        const canChat = chatLimit.dailyCount < maxDailyChats;
        const remainingChats = Math.max(0, maxDailyChats - chatLimit.dailyCount);

        return { canChat, remainingChats };
    } catch (error) {
        Logger.error("Error checking chat limit:", error);
        throw error;
    }
};

// Helper function to increment chat count
const incrementChatCount = async (userId: string): Promise<void> => {
    try {
        await ChatLimit.findOneAndUpdate(
            { userId },
            { 
                $inc: { dailyCount: 1 },
                lastResetDate: new Date()
            },
            { upsert: true }
        );
    } catch (error) {
        Logger.error("Error incrementing chat count:", error);
        throw error;
    }
};

const generateChatCompletion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message } = req.body;
        const userId = (req as any).user.id;
        
        const user = await User.findById(userId);
        if (!user) {
            Logger.error("User not found or unauthorized access attempt");
            return res.status(401).json({ message: "User not registered or unauthorized" });
        }

        // Check chat limit
        const { canChat, remainingChats } = await checkChatLimit(userId);
        
        if (!canChat) {
            Logger.warn(`User ${userId} exceeded daily chat limit`);
            return res.status(429).json({ 
                message: "Daily chat limit exceeded. You can send 4 messages per day.",
                error: "CHAT_LIMIT_EXCEEDED",
                remainingChats: 0,
                resetTime: "24 hours"
            });
        }

        // Grab chats of user
        const chats: ChatCompletionUserMessageParam[] = user.chats
            .filter(chat => chat.role === "user")
            .map(({ content }) => ({
                role: "user" as const,
                content
            }));

        chats.push({ role: "user", content: message });
        user.chats.push({ role: "user", content: message });

        // Send the chat messages to the AI service
        const openai = configAI.createOpenAI();

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: chats,
        });

        const aiMessage = response.choices[0]?.message;
        if (aiMessage) {
            user.chats.push({ role: aiMessage.role, content: aiMessage.content });
            await user.save();
            
            // Increment chat count after successful AI response
            await incrementChatCount(userId);
        }

        // Get updated remaining chats
        const { remainingChats: updatedRemaining } = await checkChatLimit(userId);

        res.status(200).json({ 
            chats: user.chats,
            remainingChats: updatedRemaining - 1, // Subtract 1 since we just used one
            dailyLimit: 4
        });

    } catch (error) {
        Logger.error("Error generating chat completion:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const user = await User.findById(userId);

        if (!user) {
            Logger.error("User not found or unauthorized access attempt");
            return res.status(401).json({ message: "User not registered or unauthorized" });
        }

        // Get chat limit info
        const { remainingChats } = await checkChatLimit(userId);

        res.status(200).json({ 
            message: "OK", 
            chats: user.chats,
            remainingChats,
            dailyLimit: 4
        });
    } catch (error) {
        Logger.error("Error fetching all chats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const user = await User.findById(userId);

        if (!user) {
            Logger.error("User not found or unauthorized access attempt");
            return res.status(401).json({ message: "User not registered or unauthorized" });
        }

        user.chats.splice(0, user.chats.length);
        await user.save();

        // Get updated chat limit info
        const { remainingChats } = await checkChatLimit(userId);

        res.status(200).json({ 
            message: "Success",
            remainingChats,
            dailyLimit: 4
        });
    } catch (error) {
        Logger.error("Error deleting all chats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// New endpoint to get chat limit info
const getChatLimitInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const { canChat, remainingChats } = await checkChatLimit(userId);
        
        res.status(200).json({
            canChat,
            remainingChats,
            dailyLimit: 4,
            resetTime: "24 hours"
        });
    } catch (error) {
        Logger.error("Error getting chat limit info:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default {
    generateChatCompletion,
    getAllChats,
    deleteChat,
    getChatLimitInfo
};