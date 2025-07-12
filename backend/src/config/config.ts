import dotenv from 'dotenv';
import Logger from '../utils/logger.js';

// Load environment variables
dotenv.config();

interface ChatbotConfig {
    // Database
    MONGODB_URI: string;

    // Server
    PORT: number;
    NODE_ENV: string;

    // JWT
    JWT_SECRET: string;
    JWT_EXPIRE: string;

    // OpenAI
    OPENAI_API_KEY: string;
    OPENAI_ORGANIZATION_ID: string;

    // Logging
    LOG_LEVEL: string;

    // Cookie
    COOKIE_SECRET: string;

    // Email
    EMAIL_USER: string;
    EMAIL_PASS: string;
    NO_REPLY_EMAIL: string;
    FRONTEND_URL: string;
}

const getEnvVar = (name: string, defaultValue?: string): string => {
    const value = process.env[name];
    if (!value && !defaultValue) {
        Logger.error(`Environment variable ${name} is required but not set`);
        throw new Error(`Environment variable ${name} is required but not set`);
    }
    return value || defaultValue!;
};

const getEnvNumber = (name: string, defaultValue?: number): number => {
    const value = process.env[name];
    if (!value && defaultValue === undefined) {
        Logger.error(`Environment variable ${name} is required but not set`);
        throw new Error(`Environment variable ${name} is required but not set`);
    }
    const numValue = Number(value || defaultValue);
    if (isNaN(numValue)) {
        Logger.error(`Environment variable ${name} must be a number`);
        throw new Error(`Environment variable ${name} must be a number`);
    }
    return numValue;
};

export const config: ChatbotConfig = {
    // Database
    MONGODB_URI: getEnvVar('MONGODB_URI'),

    // Server
    PORT: getEnvNumber('PORT', 5000),
    NODE_ENV: getEnvVar('NODE_ENV', 'development'),

    // JWT
    JWT_SECRET: getEnvVar('JWT_SECRET'),
    JWT_EXPIRE: getEnvVar('JWT_EXPIRE', '7d'),

    // OpenAI
    OPENAI_API_KEY: getEnvVar('OPENAI_API_KEY'),
    OPENAI_ORGANIZATION_ID: getEnvVar('OPENAI_ORGANIZATION_ID'),

    // Logging
    LOG_LEVEL: getEnvVar('LOG_LEVEL', 'info'),

    // Cookie
    COOKIE_SECRET: getEnvVar('COOKIE_SECRET'),

    // Email
    EMAIL_USER: getEnvVar('EMAIL_USER'),
    EMAIL_PASS: getEnvVar('EMAIL_PASS'),
    NO_REPLY_EMAIL: getEnvVar('NO_REPLY_EMAIL'),
    FRONTEND_URL: getEnvVar('FRONTEND_URL', 'http://localhost:3000'),
};

// Validate required configurations on startup
export const validateConfig = (): void => {
    Logger.info('Validating environment configuration...');

    const requiredVars = [
        'MONGODB_URI',
        'JWT_SECRET',
        'OPENAI_API_KEY',
        'OPENAI_ORGANIZATION_ID',
        'COOKIE_SECRET',
        'EMAIL_USER',
        'EMAIL_PASS',
        'NO_REPLY_EMAIL',
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        Logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
        process.exit(1);
    }

    // Log non-sensitive config info
    Logger.info(`Environment: ${config.NODE_ENV}`);
    Logger.info(`Port: ${config.PORT}`);
    Logger.info(`Frontend URL: ${config.FRONTEND_URL}`);
    Logger.info(`Log Level: ${config.LOG_LEVEL}`);
    Logger.info(`JWT Expire: ${config.JWT_EXPIRE}`);
    Logger.info(`Email User: ${config.EMAIL_USER}`);
    Logger.info('All required environment variables are set\n');
};

// Development helper functions
export const isDevelopment = (): boolean => config.NODE_ENV === 'development';
export const isProduction = (): boolean => config.NODE_ENV === 'production';
export const isTest = (): boolean => config.NODE_ENV === 'test';