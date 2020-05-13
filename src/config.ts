/* eslint-disable no-magic-numbers */

import * as dotenv from 'dotenv';
import * as path from 'path';

const {version}: {version: string} = require('../package.json');

dotenv.config();

const environment = process.env.ENVIRONMENT || 'prod';

export const defaultConfig = {
  CACHE_DURATION_SECONDS: 300, // 5 minutes
  COMPRESS_LEVEL: 6,
  COMPRESS_MIN_SIZE: 500,
  DEVELOPMENT: environment === 'dev',
  DIST_DIR: path.resolve(__dirname),
  ENVIRONMENT: environment,
  PORT_HTTP: Number(process.env.PORT) || 21080,
  VERSION: version,
};

export type ServerConfig = typeof defaultConfig;
