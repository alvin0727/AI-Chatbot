import Logger from "./utils/logger.js";
import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
import {config, validateConfig} from "./config/config.js";

async function startServer() {
  try {
    // Validate configuration
    validateConfig();

    // Connect to the database
    await connectToDatabase();
    const PORT = config.PORT || 3000;

    app.listen(PORT, () => {
      Logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    Logger.error("Error starting the server:", error.message);
  }
}

startServer();
