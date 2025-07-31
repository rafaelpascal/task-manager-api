import { AppError } from "./index";
import { NextFunction, Request, Response } from "express";

/**
 * Centralized error handling middleware. If the error is an instance of AppError
 * it will be handled here and a JSON response will be sent back to the client.
 * If the error is not an instance of AppError, it will be logged to the console
 * and a generic 500 error will be returned to the client.
 *
 * @param err The error object
 * @param req The Express Request object
 * @param res The Express Response object
 * @param next The next middleware function in the stack
 */
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    console.log(`Error Middleware ${req.method} ${req.url} - ${err.message}`);
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }
  console.log("unhandled error", err);
  return res.status(500).json({
    error: "Something went wrong, please try again!",
  });
};
