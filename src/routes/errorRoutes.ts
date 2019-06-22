import {isCelebrate} from 'celebrate';
import * as express from 'express';
import * as logdown from 'logdown';

import {formatDate} from '../utils';

const router = express.Router();

const logger = logdown('luftdaten-server/errorRoutes', {
  logger: console,
  markdown: false,
});

export const celebrateErrorRoute = (): express.ErrorRequestHandler => (err, req, res, next) => {
  if (isCelebrate(err)) {
    const message = err.joi ? err.joi.message : err.message;
    return res.status(422).json({error: `Validation error: ${message}`});
  }
  return next();
};

export const internalErrorRoute = (): express.ErrorRequestHandler => (err, req, res, next) => {
  logger.error(`[${formatDate()}] ${err.stack}`);
  const error = {
    code: 500,
    message: 'Internal server error',
    stack: err.stack,
  };
  return res.status(error.code).json(error);
};

export const notFoundRoute = () =>
  router.get('*', (req, res) => {
    const error = {
      code: 404,
      message: 'Not found',
    };
    return res.status(error.code).json(error);
  });
