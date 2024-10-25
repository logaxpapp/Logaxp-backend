/**
 * 
 * @param fn this is basically the function that is parsed to automate the error catching
 * This function is basically used to reduce the usage of try catch  in side the controller.
 * @returns 
 */
export const catchAsync = (fn: any) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch((error: any) => next(error)); //this return a function with the client parameters
};
