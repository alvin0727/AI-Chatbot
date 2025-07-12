import { Request, Response, NextFunction } from "express";
import User from "../models/User.js"
import Logger from "../utils/logger.js";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get All Users
        const users = await User.find({});
        Logger.info(`Fetched ${users.length} users`);
        return res.status(200).json({
            message: "Users fetched successfully",
            data: users
        });

    } catch (error) {
        Logger.error(`Error fetching users: ${error.message}`);
        return res.status(500).json({ message: `Error fetching users: ${error.message}` });
    }
}