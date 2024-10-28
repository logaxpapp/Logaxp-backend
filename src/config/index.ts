import * as process from "process";
import ApiError from "./apiError";

export const ENVIRONMENT = process.env.APP_ENV || 'development'
export const IS_PRODUCTION = ENVIRONMENT === 'development'
export const IS_TEST = ENVIRONMENT === 'development'
export const APP_PORT = Number(process.env.APP_PORT) || 9000
export const APP_PREFIX_PATH = process.env.APP_PREFIX_PATH || '/'
export const JWT_SECRET = process.env.JWT_SECRET || 'thT9x1TP9y2022Serv1ceis'
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '1d'
export const DB = {
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_USER_PWD,
  HOST: process.env.DB_HOST,
  NAME: process.env.DB_NAME,
  PORT: Number(process.env.DB_PORT) || 27017,
}
export const DB_URI = process.env.DB_URI
export const APP_NAME = 'Logo Beauty App'
export const APP_URL = process.env.APP_URL
export const FRONT_END_URL = process.env.FRONT_END_URL
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
export const POSTMARK_MAIL_URL = process.env.POSTMARK_MAIL_URL
export const POSTMARK_MAIL_TOKEN = process.env.POSTMARK_MAIL_TOKEN
export const SENDGRID_FROM = process.env.SENDGRID_FROM

export const POSTMARK_MAIL_FROM = process.env.POSTMARK_MAIL_FROM


export const MONNIFY_URL = process.env.MONNIFY_URL
export const MONNIFY_API_KEY = process.env.MONNIFY_API_KEY
export const MONNIFY_SECRET_KEY = process.env.MONNIFY_SECRET_KEY


// encryption details
export const SECRET_DETAILS = {
  key: process.env.SECRET_KEY
}


export const SIGN_UP_URL = process.env.SIGN_UP_URL;

export const breakPoint = () => {
  throw new ApiError(200, "break point");
};