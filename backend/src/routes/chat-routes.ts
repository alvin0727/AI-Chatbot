import { Router } from "express";
import { authenticate, requireVerified } from "../middleware/auth-middleware";
import validators from "../utils/validators/chat-validators";
import chatControllers from "../controllers/chat-controllers";


// Protected API routes for chat functionality
const chatRoutes = Router();
chatRoutes.post('/new', validators.validate(validators.chatCompletionValidator), authenticate, requireVerified, chatControllers.generateChatCompletion);
chatRoutes.get('/all-chats', authenticate, requireVerified, chatControllers.getAllChats);
chatRoutes.delete('/delete-all-chats', authenticate, requireVerified, chatControllers.deleteChat);
chatRoutes.get('/chat-limit-info', authenticate, requireVerified, chatControllers.getChatLimitInfo);

export default chatRoutes;