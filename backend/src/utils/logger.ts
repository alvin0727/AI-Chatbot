import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { config } from "../config/config";

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
  } catch (error) {
    console.warn('Could not create logs directory:', error.message);
  }
}

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const level = () => {
  const env = config.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Create transports with error handling
const createFileTransport = (filename: string, level?: string) => {
  try {
    return new winston.transports.File({
      filename: path.join(logsDir, filename),
      level: level || 'info',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.uncolorize(),
        winston.format.json()
      ),
    });
  } catch (error) {
    console.warn(`Could not create file transport for ${filename}:`, error.message);
    return null;
  }
};

const transports: winston.transport[] = [
  // Console transport (always available)
  new winston.transports.Console({
    level: level(),
    format: format,
  }),
];

// Add file transports if possible
const errorFileTransport = createFileTransport('error.log', 'error');
const combinedFileTransport = createFileTransport('combined.log');

if (errorFileTransport) transports.push(errorFileTransport);
if (combinedFileTransport) transports.push(combinedFileTransport);

// Create the logger
const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default Logger;