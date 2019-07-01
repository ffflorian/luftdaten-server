import * as express from 'express';
import * as fs from 'fs-extra';
import * as logdown from 'logdown';
import * as path from 'path';
import {Spec} from 'swagger-schema-official';

import {ServerConfig} from '../config';
import {formatDate, formatUptime} from '../utils';

const logger = logdown('luftdaten-server/mainRoute', {
  logger: console,
  markdown: false,
});

const router = express.Router();
const {uptime: nodeUptime, version: nodeVersion} = process;

interface InfoData {
  code: number;
  commit?: string;
  message: string;
  uptime: string;
}

export const mainRoute = (config: ServerConfig, swaggerDocument: Spec) => {
  const commitHashFile = path.join(config.DIST_DIR, 'commit');

  router.get('/', async (req, res) => {
    const infoData: InfoData = {
      code: 200,
      message: `luftdaten-server v${config.VERSION} ready (Node.js ${nodeVersion})`,
      uptime: formatUptime(nodeUptime()),
    };

    try {
      const commitHash = await fs.readFile(commitHashFile, {encoding: 'utf8'});
      infoData.commit = commitHash.trim();
    } catch (error) {
      logger.error(`[${formatDate()}]`, error);
    }

    res.json(infoData);
  });

  swaggerDocument.paths['/'] = {
    get: {
      produces: ['application/json'],
      responses: {
        '200': {
          description: '',
          schema: {
            $ref: '#/definitions/ServerInfo',
          },
        },
      },
      tags: ['Server'],
    },
  };

  return router;
};
