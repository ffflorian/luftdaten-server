import * as express from 'express';
import * as fs from 'fs-extra';
import * as logdown from 'logdown';
import * as path from 'path';
import type {Spec} from 'swagger-schema-official';
import {StatusCodes as HTTP_STATUS} from 'http-status-codes';

import type {ServerConfig} from '../config';
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

  router.get('/', async (_, res) => {
    const infoData: InfoData = {
      code: HTTP_STATUS.OK,
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
        [HTTP_STATUS.OK]: {
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
