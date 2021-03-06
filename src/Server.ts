import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import type {Spec} from 'swagger-schema-official';
import {StatusCodes as HTTP_STATUS} from 'http-status-codes';

import {ServerConfig, defaultConfig} from './config';
import {KnexService} from './knex/KnexService';
import {commitRoute, dataRoute, internalErrorRoute, mainRoute, robotsRoute} from './routes';

export class Server {
  readonly swaggerDocument: Spec;
  private readonly app: express.Express;
  private readonly config: ServerConfig;
  private readonly knexService: KnexService;
  private server?: http.Server;

  constructor(config?: Partial<ServerConfig>) {
    this.config = {...defaultConfig, ...config};
    this.app = express();
    this.knexService = new KnexService({development: this.config.DEVELOPMENT});
    this.swaggerDocument = {
      basePath: '/',
      info: {
        description: 'Receive and display data from your luftdaten device',
        title: 'Luftdaten',
        version: '1.0',
      },
      paths: {},
      swagger: '2.0',
    };
  }

  async init(): Promise<void> {
    this.initSwaggerDoc();
    const knexInstance = await this.knexService.init();

    this.app.disable('x-powered-by');
    this.app.use((req, res, next) => {
      bodyParser.json({limit: '200mb'})(req, res, error => {
        if (error) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({error: 'Payload is not valid JSON data.'});
        }
        return next();
      });
    });
    this.app.use((_, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
    this.app.use(
      compression({
        level: this.config.COMPRESS_LEVEL,
        threshold: this.config.COMPRESS_MIN_SIZE,
      })
    );
    this.app.use(dataRoute(knexInstance, this.swaggerDocument));
    this.app.use(commitRoute(this.config, this.swaggerDocument));
    this.app.use(mainRoute(this.config, this.swaggerDocument));
    this.app.use(robotsRoute());
    this.initSwaggerRoute();
    this.app.use(express.static(path.join(__dirname, '../static')));
    this.app.use(internalErrorRoute());
  }

  start(): Promise<number> {
    return this.init().then(
      () =>
        new Promise((resolve, reject) => {
          if (this.server) {
            reject(new Error('Server is already running.'));
          } else if (this.config.PORT_HTTP) {
            this.server = this.app.listen(this.config.PORT_HTTP, () => resolve(this.config.PORT_HTTP));
          } else {
            reject(new Error('Server port not specified.'));
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

  private initSwaggerDoc(): void {
    this.swaggerDocument.tags = [
      {
        description: 'All about the data',
        name: 'Data',
      },
      {
        description: 'Information about the server',
        name: 'Server',
      },
    ];
    this.swaggerDocument.definitions = {
      AllLuftdatenDefinitions: {
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
      Commit: {
        description: 'The latest commit hash',
        example: '178ad7dd036f7f111259b6fbe16499b9c25c57b0',
        type: 'string',
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
      DevicePayload: {
        allOf: [
          {
            $ref: '#/definitions/Esp8266id',
          },
        ],
        properties: {
          sensordatavalues: {
            items: {
              $ref: '#/definitions/SensorValue',
            },
            type: 'array',
          },
          software_version: {
            type: 'string',
          },
        },
        type: 'object',
      },
      Esp8266id: {
        description: 'The sensor ID',
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
        allOf: [
          {
            $ref: '#/definitions/CreatedAt',
          },
        ],
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
      Samples: {
        properties: {
          samples: {
            type: 'integer',
          },
        },
        type: 'object',
      },
      SensorValue: {
        description: 'A sensor value, e.g. `{ "value_type": "humidity", "value": "37.10" }`',
        properties: {
          value: {
            type: 'string',
          },
          value_type: {
            description: 'The type of sensor, e.g. "humidity"',
            type: 'string',
          },
        },
        type: 'object',
      },
      ServerInfo: {
        properties: {
          code: {
            type: 'integer',
          },
          commit: {
            $ref: '#/definitions/Commit',
          },
          message: {
            type: 'string',
          },
          uptime: {
            type: 'string',
          },
        },
        required: ['code', 'message', 'uptime'],
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
        allOf: [
          {
            $ref: '#/definitions/Esp8266id',
          },
        ],
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

  private initSwaggerRoute(): void {
    const swaggerOptions: swaggerUi.SwaggerOptions = {
      host: `localhost:${this.config.PORT_HTTP}`,
    };

    this.app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(this.swaggerDocument, {}, {options: swaggerOptions}));
  }
}
