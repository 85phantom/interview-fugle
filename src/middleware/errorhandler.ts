import { Request, Response, NextFunction } from 'express';
import { BaseError, GeneralError } from '../error';
import { CommonResponse } from '../schema/common';

// eslint-disable-next-line
const errorHandler = () => {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof BaseError)) {
      const newError = new GeneralError(
        { body: req.body },
        { originalError: err, trackingCode: req.trackingCode },
      );
      const response = new CommonResponse<{}>({
        success: false,
        error: newError,
      });
      return res.status(500).json(response);
    }

    const response = new CommonResponse<{}>({
      success: false,
      error: err,
    });
    return res.status(err.code || 500).json(response);
  };
};

export default errorHandler;
