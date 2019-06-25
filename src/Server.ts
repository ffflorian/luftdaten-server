import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as express from 'express';
import * as expressHandlebars from 'express-handlebars';
import initializeHelpers = require('handlebars-helpers');
import * as helmet from 'helmet';
import * as http from 'http';
import * as path from 'path';
import {Spec} from 'swagger-schema-official';
import * as swaggerUi from 'swagger-ui-express';

import {ServerConfig} from './config';
import {KnexService} from './knex/KnexService';
import {dataRoute, internalErrorRoute, mainRoute, robotsRoute} from './routes';

initializeHelpers(['comparison']);

export class Server {
  private readonly app: express.Express;
  private readonly knexService: KnexService;
  private readonly swaggerDocument: Spec;
  private server?: http.Server;

  constructor(private readonly config: ServerConfig) {
    this.app = express();
    this.knexService = new KnexService({development: config.DEVELOPMENT});
    this.swaggerDocument = {
      basePath: '/',
      info: {
        description: 'Receive and display data from your luftdaten device',
        title: 'Luftdaten Server',
        version: '1.0',
      },
      paths: {},
      swagger: '2.0',
    };
  }

  async init(): Promise<void> {
    this.initSwaggerDoc();
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
    this.app.use(dataRoute(knexInstance, this.swaggerDocument));
    this.app.use(mainRoute());
    this.app.use(robotsRoute());
    this.initSwaggerRoute();
    this.app.use(express.static(path.join(__dirname, '../static')));
    this.app.use(internalErrorRoute());
  }

  private initSecurityHeaders(): void {
    this.app.disable('x-powered-by');
    this.app.use(
      helmet({
        frameguard: {action: 'deny'},
      })
    );
  }

  private initSwaggerRoute(): void {
    const swaggerUiOptions = {
      host: `localhost:${this.config.PORT_HTTP}`,
    };

    this.app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(this.swaggerDocument, swaggerUiOptions));
  }

  private initSwaggerDoc(): void {
    this.swaggerDocument.definitions = {
      AllSchemas: {
        allOf: [
          {
            $ref: '#/definitions/CreatedAt',
          },
          {
            $ref: '#/definitions/Esp8266id',
          },
          {
            $ref: '#/definitions/Humidity',
          },
          {
            $ref: '#/definitions/Id',
          },
          {
            $ref: '#/definitions/MaxMicro',
          },
          {
            $ref: '#/definitions/MinMicro',
          },
          {
            $ref: '#/definitions/Samples',
          },
          {
            $ref: '#/definitions/SDS_P1',
          },
          {
            $ref: '#/definitions/SDS_P2',
          },
          {
            $ref: '#/definitions/Signal',
          },
          {
            $ref: '#/definitions/SoftwareVersion',
          },
          {
            $ref: '#/definitions/Temperature',
          },
          {
            $ref: '#/definitions/UpdatedAt',
          },
        ],
        type: 'object',
      },
      CreatedAt: {
        properties: {
          created_at: {
            format: 'date-time',
            type: 'string',
          },
        },
        type: 'object',
      },
      Esp8266id: {
        properties: {
          esp8266id: {
            type: 'string',
          },
        },
        type: 'object',
      },
      Humidity: {
        properties: {
          humidity: {
            format: 'float',
            type: 'number',
          },
        },
        type: 'object',
      },
      Id: {
        properties: {
          created_at: {
            format: 'date-time',
            type: 'string',
          },
        },
        type: 'object',
      },
      MaxMicro: {
        properties: {
          max_micro: {
            type: 'integer',
          },
        },
        type: 'object',
      },
      MinMicro: {
        properties: {
          min_micro: {
            type: 'integer',
          },
        },
        type: 'object',
      },
      Samples: {
        properties: {
          samples: {
            type: 'integer',
          },
        },
        type: 'object',
      },
      SDS_P1: {
        properties: {
          SDS_P1: {
            format: 'float',
            type: 'number',
          },
        },
        type: 'object',
      },
      SDS_P2: {
        properties: {
          SDS_P2: {
            format: 'float',
            type: 'number',
          },
        },
        type: 'object',
      },
      Signal: {
        properties: {
          signal: {
            type: 'integer',
          },
        },
        type: 'object',
      },
      SoftwareVersion: {
        properties: {
          esp8266id: {
            type: 'string',
          },
        },
        type: 'object',
      },
      Temperature: {
        properties: {
          temperature: {
            format: 'float',
            type: 'number',
          },
        },
        type: 'object',
      },
      UpdatedAt: {
        properties: {
          updated_at: {
            format: 'date-time',
            type: 'string',
          },
        },
        type: 'object',
      },
    };
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
