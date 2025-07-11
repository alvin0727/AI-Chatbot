import { connect, disconnect } from "mongoose";
import Logger from "../utils/logger.js";

async function connectToDatabase() {
    try {
        Logger.info("Attempting to connect to MongoDB...");
        await connect(process.env.MONGODB_URI);
        Logger.info("Successfully connected to MongoDB");
    } catch (error) {
        Logger.error(`Failed to connect to MongoDB: ${error.message}`);
        throw new Error("Failed to connect to MongoDB");
    }
}
async function disconnectFromDatabase() {
    try {
        await disconnect();
        Logger.info("Successfully disconnected from MongoDB");
    } catch (error) {
        Logger.error(`Failed to disconnect from MongoDB: ${error.message}`);
        throw new Error("Failed to disconnect from MongoDB");
    }
}

export {connectToDatabase, disconnectFromDatabase};