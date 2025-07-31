import { Request, Response, NextFunction } from "express";

/**
 * Middleware function for logging HTTP requests.
 *
 * Logs the HTTP method and URL of each incoming request with a timestamp.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param next - The next middleware function in the stack.
 */
export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
