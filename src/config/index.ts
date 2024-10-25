import ApiError from "./apiError";
export { catchAsync } from "./catchError";
export { logger } from "./logger";
export { morganErrorHandler, morganSuccessHandler } from "./morgan";
export { ApiError };
export const APP_PORT = process.env.PORT || 1011;
export const IS_PRODUCTION = process.env.APP_ENV !== "development";
export const DB_URI = process.env.DB_URI;
export const IS_TEST = process.env.APP_ENV === "test";
export const DB = {
  HOST: process.env.HOST,
  NAME: process.env.NAME,
  PASSWORD: process.env.PASSWORD,
  USER: process.env.USER,
  PORT: process.env.PORT,
};
export const rapidApi = {
  rapid_api_ua: process.env.RAPID_API_UA,
  rapid_api_key: process.env.RAPID_API_KEY,
  rapid_api_host: process.env.RAPID_API_HOST,
};

export const APP_NAME = process.env.APP_NAME;
export const APP_PREFIX_PATH = process.env.APP_PREFIX_PATH;
