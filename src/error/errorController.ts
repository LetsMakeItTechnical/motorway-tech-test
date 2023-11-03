import { NextFunction, Request, Response } from 'express';

const sendErrorDev = (err: Record<string, any>, _req: Request, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: Record<string, any>, req: Request, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default (err: Record<string, any>, req: Request, res: Response, _next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };

  if (process.env.NODE_ENV !== 'production') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};
