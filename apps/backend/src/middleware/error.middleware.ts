// src/middlewares/error.middleware.ts
import type{ ErrorRequestHandler } from 'express';
import { CustomError } from '../error/customError';
export const ErrorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.path} - ${message}`);
  if (statusCode === 500) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
