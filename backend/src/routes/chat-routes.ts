import { Router } from "express";
import { authenticate, requireVerified } from "../middleware/auth-middleware.js";
import validators from "../utils/validators/chat-validators.js";
import chatControllers from "../controllers/chat-controllers.js";


// Protected API routes for chat functionality
const chatRoutes = Router();
chatRoutes.post('/new', validators.validate(validators.chatCompletionValidator), authenticate, requireVerified, chatControllers.generateChatCompletion);
chatRoutes.get('/all-chats', authenticate, requireVerified, chatControllers.getAllChats);

export default chatRoutes;