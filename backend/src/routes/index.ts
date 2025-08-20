import { Router } from "express";
import userRoutes from "./user-routes";
import chatRoutes from "./chat-routes";

const appRouter = Router(); 

appRouter.use("/users", userRoutes); //domain/api/v1/users
appRouter.use("/chat", chatRoutes); //domain/api/v1/chat

export default appRouter;