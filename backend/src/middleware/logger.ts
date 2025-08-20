import morgan from 'morgan';
import Logger from '../utils/logger';

// Custom stream for Winston
const stream = {
  write: (message: string) => {
    Logger.http(message.trim());
  }
};

// Morgan middleware for success requests
export const httpLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream,
    skip: (req, res) => res.statusCode >= 400 // Skip error responses
  }
);

// Morgan middleware for error requests
export const errorLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message: string) => {
        Logger.error(message.trim());
      }
    },
    skip: (req, res) => res.statusCode < 400 // Only log error responses
  }
);