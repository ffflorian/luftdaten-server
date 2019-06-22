import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as express from 'express';
import * as helmet from 'helmet';
import * as http from 'http';

import {ServerConfig} from './config';
import {dataRoute, internalErrorRoute, mainRoute} from './routes';

export class Server {
  private readonly app: express.Express;
  private server?: http.Server;

  constructor(private readonly config: ServerConfig) {
    this.app = express();
    this.init();
  }

  init(): void {
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
    this.app.use(dataRoute());
    this.app.use(mainRoute(this.config));
    this.app.use(internalErrorRoute());
  }

  // initCaching(): void {
  //   if (this.config.DEVELOPMENT) {
  //     this.app.use(helmet.noCache());
  //   } else {
  //     this.app.use((req, res, next) => {
  //       const milliSeconds = 1000;
  //       res.header('Cache-Control', `public, max-age=${this.config.CACHE_DURATION_SECONDS}`);
  //       res.header('Expires', new Date(Date.now() + this.config.CACHE_DURATION_SECONDS * milliSeconds).toUTCString());
  //       next();
  //     });
  //   }
  // }

  // initForceSSL(): void {
  //   const STATUS_CODE_MOVED = 301;

  //   const SSLMiddleware: express.RequestHandler = (req, res, next) => {
  //     // Redirect to HTTPS
  //     if (!req.secure || req.get('X-Forwarded-Proto') !== 'https') {
  //       if (this.config.DEVELOPMENT || req.url.match(/_health\/?/)) {
  //         return next();
  //       }
  //       return res.redirect(STATUS_CODE_MOVED, `https://${req.headers.host}${req.url}`);
  //     }
  //     next();
  //   };

  //   this.app.enable('trust proxy');
  //   this.app.use(SSLMiddleware);
  // }

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
    return new Promise((resolve, reject) => {
      if (this.server) {
        reject('Server is already running.');
      } else if (this.config.PORT_HTTP) {
        this.server = this.app.listen(this.config.PORT_HTTP, () => resolve(this.config.PORT_HTTP));
      } else {
        reject('Server port not specified.');
      }
    });
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
