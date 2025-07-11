import express from 'express';
import { config } from 'dotenv';
import { httpLogger, errorLogger } from './middleware/logger.js';


config();
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to log HTTP requests
app.use(httpLogger);

// Middleware to handle errors
app.use(errorLogger);

export default app;
