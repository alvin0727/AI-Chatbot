import winston from 'winston';
import path from 'path';
import { config } from "../config/config.js";

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

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which logs to print
const level = () => {
  const env = config.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define which transports to use
const transports = [
  // Console transport
  new winston.transports.Console({
    level: level(),
    format: format,
  }),
  // File transport for errors (without colors)
  new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
    maxsize: 5 * 1024 * 1024, // 5 MB
    maxFiles: 3,              // Keep 3 backup files
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.uncolorize(),
      winston.format.json()
    ),
  }),
  // File transport for all logs (without colors)
  new winston.transports.File({
    filename: path.join('logs', 'combined.log'),
    maxsize: 10 * 1024 * 1024, // 10 MB
    maxFiles: 5,               // Keep 5 backup files
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.uncolorize(),
      winston.format.json()
    ),
  }),
];

// Create the logger
const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default Logger;
