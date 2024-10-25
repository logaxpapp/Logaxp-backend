import express from "express";
import helmet from "helmet";
// import xss from 'xss-clean'
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import cors from "cors";
import routes from "@/routes";
import { morganErrorHandler, morganSuccessHandler } from "@/config";
import { APP_NAME, APP_PREFIX_PATH, IS_TEST } from "@/config";
import httpStatus from "http-status";
import { ApiError } from "@/config";
import fileUpload from "express-fileupload";
import path from "path";
import { errorConverter, errorHandler } from "./middleware/error.middleware";

const app = express();

if (!IS_TEST) {
  app.use(morganSuccessHandler);
  app.use(morganErrorHandler);
}

// set security HTTP headers
app.use(helmet());

// set ejs as template engine
app.set("view engine", "ejs");

// parse json request body
app.use(express.json({ limit: "1024mb" }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
// app.use(xss())
app.use(mongoSanitize());

// gzip compression
app.use(compression());

app.use(cors());

app.use(
  fileUpload({
    limits: { fileSize: 3 * 1024 * 1024 },
    // abortOnLimit: true,
    // responseOnLimit: 'File cannot exceed 3MB'
    // 3052189
  })
);

app.get("/", (_req, res) => {
  res.status(httpStatus.OK).send({
    service: `${APP_NAME}`,
    message: `Welcome to the ${APP_NAME}!`,
  });
});

// This route serve the uploaded files
app.use(
  path.join(__dirname, "/storage/documents"),
  express.static(path.join(__dirname, "/storage/documents"))
);

app.use(APP_PREFIX_PATH, routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
