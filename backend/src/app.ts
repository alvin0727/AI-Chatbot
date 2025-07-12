import express from 'express';
import { config } from 'dotenv';
import { httpLogger, errorLogger } from './middleware/logger.js';
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import { config as appConfig } from './config/config.js';

config();
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser(appConfig.COOKIE_SECRET)); // Optional secret for signed cookies

// Middleware to log HTTP requests
app.use(httpLogger);

// Middleware to handle errors
app.use(errorLogger);

app.use("/api/v1", appRouter);

export default app;
