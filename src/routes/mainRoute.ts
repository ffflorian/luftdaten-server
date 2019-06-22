import * as express from 'express';

import {ServerConfig} from '../config';

const router = express.Router();

export const mainRoute = (config: ServerConfig) => {
  return router.get('/', async (req, res) => {
    res.send('hello');
  });
};
