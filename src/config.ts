import * as dotenv from 'dotenv';

const {version}: {version: string} = require('../package.json');

dotenv.config();

export interface ServerConfig {
  CACHE_DURATION_SECONDS: number;
  COMPRESS_LEVEL: number;
  COMPRESS_MIN_SIZE: number;
  PORT_HTTP: number;
  VERSION: string;
}

export const config: ServerConfig = {
  CACHE_DURATION_SECONDS: 300, // 5 minutes
  COMPRESS_LEVEL: 6,
  COMPRESS_MIN_SIZE: 500,
  PORT_HTTP: Number(process.env.PORT) || 21080,
  VERSION: version,
};
