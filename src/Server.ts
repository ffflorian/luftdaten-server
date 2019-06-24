import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as express from 'express';
import * as expressHandlebars from 'express-handlebars';
import * as helmet from 'helmet';
import * as http from 'http';

import {ServerConfig} from './config';
import {KnexService} from './knex/KnexService';
import {dataRoute, internalErrorRoute, mainRoute, robotsRoute} from './routes';

export class Server {
  private readonly app: express.Express;
  private readonly knexService: KnexService;
  private server?: http.Server;

  constructor(private readonly config: ServerConfig) {
    this.app = express();
    this.knexService = new KnexService({development: config.DEVELOPMENT});
  }

  async init(): Promise<void> {
    const knexInstance = await this.knexService.init();

    this.app.engine('handlebars', expressHandlebars());
    this.app.set('view engine', 'handlebars');

    this.app.use((req, res, next) => {
      bodyParser.json({limit: '200mb'})(req, res, error => {
        if (error) {
          return res.status(400).json({error: 'Payload is not valid JSON data.'});
        }
        return next();
      });
    });
    this.initSecurityHeaders();
    this.app.use(
      compression({
        level: this.config.COMPRESS_LEVEL,
        threshold: this.config.COMPRESS_MIN_SIZE,
      })
    );
    this.app.use(dataRoute(knexInstance));
    this.app.use(mainRoute(knexInstance));
    this.app.use(robotsRoute());
    this.app.use(internalErrorRoute());
  }

  initCaching(): void {
    if (this.config.DEVELOPMENT) {
      this.app.use(helmet.noCache());
    } else {
      this.app.use((req, res, next) => {
        const milliSeconds = 1000;
        res.header('Cache-Control', `public, max-age=${this.config.CACHE_DURATION_SECONDS}`);
        res.header('Expires', new Date(Date.now() + this.config.CACHE_DURATION_SECONDS * milliSeconds).toUTCString());
        next();
      });
    }
  }

  initSecurityHeaders(): void {
    this.app.disable('x-powered-by');
    this.app.use(
      helmet({
        frameguard: {action: 'deny'},
      })
    );
    this.app.use(helmet.noSniff());
    this.app.use(helmet.xssFilter());
  }

  start(): Promise<number> {
    return this.init().then(
      () =>
        new Promise((resolve, reject) => {
          if (this.server) {
            reject('Server is already running.');
          } else if (this.config.PORT_HTTP) {
            this.server = this.app.listen(this.config.PORT_HTTP, () => resolve(this.config.PORT_HTTP));
          } else {
            reject('Server port not specified.');
          }
        })
    );
  }

  async stop(): Promise<void> {
    if (this.server) {
      this.server.close();
      this.server = undefined;
    } else {
      throw new Error('Server is not running.');
    }
  }
}
