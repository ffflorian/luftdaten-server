import * as express from 'express';
import * as logdown from 'logdown';
import * as HTTP_STATUS from 'http-status-codes';

import {formatDate} from '../utils';

const router = express.Router();

const logger = logdown('luftdaten-server/errorRoutes', {
  logger: console,
  markdown: false,
});

export const internalErrorRoute = (): express.ErrorRequestHandler => (err, _, res) => {
  logger.error(`[${formatDate()}] ${err.stack}`);
  const error = {
    code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
    stack: err.stack,
  };
  return res.status(error.code).json(error);
};

export const notFoundRoute = () =>
  router.get('*', (_, res) => {
    const error = {
      code: HTTP_STATUS.NOT_FOUND,
      message: 'Not found',
    };
    return res.status(error.code).json(error);
  });
