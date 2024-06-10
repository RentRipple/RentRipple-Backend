import { Request, Response } from "express";
import { HttpError } from "http-errors";

const errorHandler = (err: HttpError, req: Request, res: Response) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: {
      code: status,
      message: message,
    },
  });
};

export default errorHandler;
