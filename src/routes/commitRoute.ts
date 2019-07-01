import * as express from 'express';
import * as fs from 'fs-extra';
import * as path from 'path';
import {Spec} from 'swagger-schema-official';

import {ServerConfig} from '../config';

const router = express.Router();

export const commitRoute = (config: ServerConfig, swaggerDocument: Spec) => {
  const commitHashFile = path.join(config.DIST_DIR, 'commit');

  router.get('/commit/?', async (req, res) => {
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

  swaggerDocument.paths['/commit'] = {
    get: {
      produces: ['text/plain'],
      responses: {
        '200': {
          description: '',
          schema: {
            type: 'string',
          },
        },
      },
      summary: 'Get the latest commit hash as plain text',
      tags: ['Server'],
    },
  };

  return router;
};
