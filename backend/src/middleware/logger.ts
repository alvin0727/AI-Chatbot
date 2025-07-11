import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger.js';

// Morgan-like middleware for logging HTTP requests
export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log the request
  Logger.http(`${req.method} ${req.url} - ${req.ip}`);

  // Override res.end to log response
  const originalEnd = res.end.bind(res);
  
  res.end = function(this: Response, chunk?: any, encoding?: BufferEncoding | (() => void), cb?: () => void) {
    const duration = Date.now() - start;
    const size = res.get('Content-Length') || 0;
    
    Logger.http(
      `${req.method} ${req.url} ${res.statusCode} ${duration}ms - ${size}b`
    );
    
    // Call the original end method with proper arguments
    if (typeof encoding === 'function') {
      return originalEnd(chunk, encoding);
    } else {
      return originalEnd(chunk, encoding, cb);
    }
  };

  next();
};

// Error logging middleware
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  Logger.error(`${err.name}: ${err.message}`);
  Logger.error(`Stack: ${err.stack}`);
  Logger.error(`Request: ${req.method} ${req.url}`);
  Logger.error(`Body: ${JSON.stringify(req.body)}`);
  Logger.error(`Params: ${JSON.stringify(req.params)}`);
  Logger.error(`Query: ${JSON.stringify(req.query)}`);
  
  next(err);
};
