/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { JWT_SECRET, breakPoint } from '../config';
import { User } from '@/model/user.model';
import ApiError from './apiError';

/**
 * Generate token based on payload.
 */
export function seal(data: any, secret: string, ttl: number | string): Promise<string> {
  const expiresIn = typeof ttl === 'number' ? `${ttl}s` : ttl;
  return new Promise((resolve, reject) => {
    const claim = data.toJSON ? data.toJSON() : data;
    jwt.sign({ ...claim }, secret, { expiresIn }, (err, sig) => {
      if (err) return reject(err);
      resolve(sig);
    });
  });
}

/**
 * Verifies user provided token
 */
export function unseal(token: string, secret: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, secret, (err, val) => {
        if (err) return reject(err);
        return resolve(val);
      });
    } catch (error) {

    }
  });
}

/**
 * Authenticate logged in user
 */
export const authenticated = async (req: Request | any, res: Response, next: NextFunction) => {
  try {
    if (typeof req.headers.authorization === 'undefined') throw new ApiError(httpStatus.UNAUTHORIZED, 'authentication not provided!')

    const token = req.headers.authorization.split(' ');

    if (token && token[0] == 'Bearer') {
      const token_user = await unseal(token[1], JWT_SECRET);
      //console.log(token_user)
      const user = await User.findById(token_user._id).select('-__v  -salt');
      if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'unknown user detected!')

      req.user = user;
      next();
    } else {
      // throw new Error();
      throw new ApiError(httpStatus.UNAUTHORIZED, 'request is not authorized!')
    }

  } catch (err) {
    next(err)
  }
}



