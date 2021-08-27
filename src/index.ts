import * as logdown from 'logdown';

import {Server} from './Server';
import {formatDate} from './utils';

const logger = logdown('luftdaten-server/index', {
  logger: console,
  markdown: false,
});

const server = new Server();

server
  .start()
  .then(port => logger.info(`[${formatDate()}] Server is running on port ${port}.`))
  .catch(error => {
    logger.error(`[${formatDate()}]`, error);
    process.exit(1);
  });

process.on('SIGINT', async () => {
  logger.log(`[${formatDate()}] Received "SIGINT" signal. Exiting.`);
  try {
    await server.stop();
  } catch (error) {
    logger.error(`[${formatDate()}]`, error);
  }
  process.exit();
});

process.on('SIGTERM', async () => {
  logger.log(`[${formatDate()}] Received "SIGTERM" signal. Exiting.`);
  try {
    await server.stop();
  } catch (error) {
    logger.error(`[${formatDate()}]`, error);
  }
  process.exit();
});

process.on('uncaughtException', error => {
  console.error(`[${formatDate()}] Uncaught exception: ${(error as Error).message}`, error);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error(`[${formatDate()}] Unhandled rejection at:`, promise, 'reason:', reason);
});
