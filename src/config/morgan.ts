import morgan from "morgan";
import { IS_PRODUCTION } from "@/config";
import { logger } from "@/config";

// morgan.token('message', (req, res) => res.locals.errorMessage || '');

const getIpFormat = () => (IS_PRODUCTION ? ":remote-addr - " : ""); //this gets the IP
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
// const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;

/**
 * The function below is used to handle success request handler
 */
export const morganSuccessHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

/**
 * The function below is used to handle error request handler
 */
export const morganErrorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});
