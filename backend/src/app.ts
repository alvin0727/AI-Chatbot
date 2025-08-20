import express from 'express';
import { config } from 'dotenv';
import { httpLogger, errorLogger } from './middleware/logger';
import cors from 'cors';
import appRouter from './routes/index';
import cookieParser from 'cookie-parser';
import { config as appConfig } from './config/config';

config();
const app = express();

// Middleware to parse JSON bodies
app.use(cors({
    origin: [
        appConfig.FRONTEND_URL,
        'https://fechatbot.alvinboys.id',
        'http://localhost:3001',
        'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json());
app.use(cookieParser(appConfig.COOKIE_SECRET)); // Optional secret for signed cookies

// Middleware to log HTTP requests
app.use(httpLogger);

app.use("/api/v1", appRouter);

// Middleware to handle errors
app.use(errorLogger);

export default app;
