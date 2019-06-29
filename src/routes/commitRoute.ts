import * as express from 'express';
import * as fs from 'fs-extra';
import * as path from 'path';

import {ServerConfig} from '../config';

const router = express.Router();

export const commitRoute = (config: ServerConfig) => {
  const commitHashFile = path.join(config.DIST_DIR, 'commit');

  return router.get('/commit/?', async (req, res) => {
    try {
      const commitHash = await fs.readFile(commitHashFile, {encoding: 'utf8'});
      return res.contentType('text/plain; charset=UTF-8').send(commitHash.trim());
    } catch (error) {
      if (config.DEVELOPMENT) {
        return res.contentType('text/plain; charset=UTF-8').send('DEVELOPMENT');
      }
      return res.status(500).json({error: error.message, stack: error.stack});
    }
  });
};
