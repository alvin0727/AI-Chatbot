import express from 'express';
import { config } from 'dotenv';
import { httpLogger, errorLogger } from './middleware/logger.js';
import appRouter from './routes/index.js';


config();
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to log HTTP requests
app.use(httpLogger);

// Middleware to handle errors
app.use(errorLogger);

app.use("/api/v1", appRouter);

export default app;
