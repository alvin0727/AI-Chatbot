import Logger from "./utils/logger.js";
import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

// Connection and listening to the database

async function startServer() {
  try {
    await connectToDatabase();
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      Logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    Logger.error("Error starting the server:", error.message);
  }
}

startServer();
