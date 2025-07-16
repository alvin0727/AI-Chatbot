import { Request, Response, NextFunction } from "express";
import User from "../models/user.js";
import configAI from "../config/openai-config.js";
import { ChatCompletionUserMessageParam } from "openai/resources/chat/completions";
import Logger from "../utils/logger.js";


const generateChatCompletion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message } = req.body;
        const user = await User.findById((req as any).user.id);

        if (!user) {
            Logger.error("User not found or unauthorized access attempt");
            return res.status(401).json({ message: "User not registered or unauthorized" });
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
        }

        res.status(200).json({ chats: user.chats });
    } catch (error) {
        Logger.error("Error generating chat completion:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default {
    generateChatCompletion
};