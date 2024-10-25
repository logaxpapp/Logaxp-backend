import { ApiError, IS_PRODUCTION, IS_TEST, logger } from "@/config";
import { NextFunction } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";

/**
 *
 * @param err This is the error object
 * @param req
 * @param res
 * @param next
 * this error handler basically helps to handle errors
 */
export const errorHandler = async (err: any, req: any, res: any, next: any) => {
  try {
    let { statusCode, message } = err;
    if (IS_PRODUCTION && !err.isOperational) {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }
    res.locals.errorMessage = err.message;
    const response = {
      code: statusCode,
      message: message,
      ...(!IS_PRODUCTION && { stack: err.stack }),
    };
    if (!IS_PRODUCTION && !IS_TEST) {
      logger.error(err);
    }
    res.status(statusCode).send(response);
  } catch (error) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.message);
  }
};

/**
 * 
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 * errorConverter is used to convert errors that are not properlly catched
 */
export const errorConverter = async (
  err: any,
  req: any,
  res: any,
  next: any
) => {
  try {
    let error = err;
    if (!(err instanceof ApiError)) {
      let statusCode =
        error.statusCode || error instanceof mongoose.Error
          ? httpStatus.BAD_REQUEST
          : httpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || httpStatus[statusCode];
      error = new ApiError(statusCode, message as string, true, err.stack);
    }
    next(error);
  } catch (error) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.message);
  }
};
