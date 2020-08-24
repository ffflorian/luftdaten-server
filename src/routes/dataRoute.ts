import * as express from 'express';
import * as Knex from 'knex';
import {Spec} from 'swagger-schema-official';
import {StatusCodes as HTTP_STATUS} from 'http-status-codes';

import {DevicePayload} from '../DevicePayload';
import {KnexResult, KnexUpdate, TABLE} from '../knex/KnexService';
import {buildDataFromPayload, fixTimeZone} from '../utils';

const router = express.Router();

// eslint-disable-next-line no-magic-numbers
const getLimit = (limitString?: string, maximum = 10_000): number => {
  const defaultLimit = 20;

  if (limitString) {
    try {
      const parsedLimit = parseInt(limitString, 10);
      return parsedLimit > maximum ? defaultLimit : parsedLimit;
    } catch (error) {
      return defaultLimit;
    }
  }

  return defaultLimit;
};

export const dataRoute = (knexInstance: Knex<KnexResult, KnexUpdate>, swaggerDocument: Spec) => {
  router.get('/data/humidity/?', async (req, res) => {
    const limit = getLimit(req.query.limit?.toString());
    const result = await knexInstance(TABLE.LUFTDATEN)
      .select('created_at', 'humidity')
      .orderBy('created_at', 'desc')
      .limit(limit);
    return res.json(fixTimeZone(result));
  });

  swaggerDocument.paths['/data/humidity'] = {
    get: {
      parameters: [
        {
          description: '',
          in: 'query',
          name: 'limit',
          required: false,
          type: 'integer',
        },
      ],
      produces: ['application/json'],
      responses: {
        [HTTP_STATUS.OK]: {
          description: '',
          schema: {
            items: {
              allOf: [
                {
                  $ref: '#/definitions/CreatedAt',
                },
                {
                  $ref: '#/definitions/Humidity',
                },
              ],
            },
            type: 'array',
          },
        },
      },
      tags: ['Data'],
    },
  };

  router.get('/data/temperature/?', async (req, res) => {
    const limit = getLimit(req.query.limit?.toString());
    const result = await knexInstance(TABLE.LUFTDATEN)
      .select('created_at', 'temperature')
      .orderBy('created_at', 'desc')
      .limit(limit);
    return res.json(fixTimeZone(result));
  });

  swaggerDocument.paths['/data/temperature'] = {
    get: {
      parameters: [
        {
          description: '',
          in: 'query',
          name: 'limit',
          required: false,
          type: 'integer',
        },
      ],
      produces: ['application/json'],
      responses: {
        [HTTP_STATUS.OK]: {
          description: '',
          schema: {
            items: {
              allOf: [
                {
                  $ref: '#/definitions/CreatedAt',
                },
                {
                  $ref: '#/definitions/Temperature',
                },
              ],
            },
            type: 'array',
          },
        },
      },
      tags: ['Data'],
    },
  };

  router.get('/data/sds_p1/?', async (req, res) => {
    const limit = getLimit(req.query.limit?.toString());
    const result = await knexInstance(TABLE.LUFTDATEN)
      .select('created_at', 'SDS_P1')
      .orderBy('created_at', 'desc')
      .limit(limit);
    return res.json(fixTimeZone(result));
  });

  swaggerDocument.paths['/data/sds_p1'] = {
    get: {
      parameters: [
        {
          description: '',
          in: 'query',
          name: 'limit',
          required: false,
          type: 'integer',
        },
      ],
      produces: ['application/json'],
      responses: {
        [HTTP_STATUS.OK]: {
          description: '',
          schema: {
            items: {
              allOf: [
                {
                  $ref: '#/definitions/CreatedAt',
                },
                {
                  $ref: '#/definitions/SDS_P1',
                },
              ],
            },
            type: 'array',
          },
        },
      },
      tags: ['Data'],
    },
  };

  router.get('/data/sds_p2/?', async (req, res) => {
    const limit = getLimit(req.query.limit?.toString());
    const result = await knexInstance(TABLE.LUFTDATEN)
      .select('created_at', 'SDS_P2')
      .orderBy('created_at', 'desc')
      .limit(limit);
    return res.json(fixTimeZone(result));
  });

  swaggerDocument.paths['/data/sds_p2'] = {
    get: {
      parameters: [
        {
          description: '',
          in: 'query',
          name: 'limit',
          required: false,
          type: 'integer',
        },
      ],
      produces: ['application/json'],
      responses: {
        [HTTP_STATUS.OK]: {
          description: '',
          schema: {
            items: {
              allOf: [
                {
                  $ref: '#/definitions/CreatedAt',
                },
                {
                  $ref: '#/definitions/SDS_P2',
                },
              ],
            },
            type: 'array',
          },
        },
      },
      tags: ['Data'],
    },
  };

  router.get('/data/latest/?', async (req, res) => {
    const limit = getLimit(req.query.limit?.toString());
    const result = await knexInstance(TABLE.LUFTDATEN).select('*').orderBy('created_at', 'desc').limit(limit);
    return res.json(fixTimeZone(result));
  });

  swaggerDocument.paths['/data/latest'] = {
    get: {
      parameters: [
        {
          description: '',
          in: 'query',
          name: 'limit',
          required: false,
          type: 'integer',
        },
      ],
      produces: ['application/json'],
      responses: {
        [HTTP_STATUS.OK]: {
          description: '',
          schema: {
            items: {
              $ref: '#/definitions/AllLuftdatenDefinitions',
            },
            type: 'array',
          },
        },
      },
      tags: ['Data'],
    },
  };

  router.get('/data/:id', async (req, res) => {
    const requestId = req.params.id;
    const result = await knexInstance(TABLE.LUFTDATEN).select('*').where({id: requestId});

    if (result.length) {
      return res.json(fixTimeZone(result)[0]);
    }

    return res.sendStatus(HTTP_STATUS.NOT_FOUND);
  });

  swaggerDocument.paths['/data/{id}'] = {
    get: {
      parameters: [
        {
          description: '',
          in: 'path',
          minimum: 1,
          name: 'id',
          required: true,
          type: 'integer',
        },
      ],
      produces: ['application/json'],
      responses: {
        [HTTP_STATUS.OK]: {
          description: '',
          schema: {
            $ref: '#/definitions/AllLuftdatenDefinitions',
          },
        },
      },
      tags: ['Data'],
    },
  };

  router.post('/data/?', async (req, res) => {
    const payload: DevicePayload = req.body;

    const data = buildDataFromPayload(payload);

    await knexInstance(TABLE.LUFTDATEN).insert(data);

    return res.sendStatus(HTTP_STATUS.OK);
  });

  swaggerDocument.paths['/data'] = {
    post: {
      consumes: ['application/json'],
      parameters: [
        {
          description: '',
          in: 'body',
          name: 'body',
          required: true,
          schema: {
            $ref: '#/definitions/DevicePayload',
          },
        },
      ],
      responses: {
        [HTTP_STATUS.OK]: {
          description: 'Data is ok',
        },
      },
      tags: ['Data'],
    },
  };

  return router;
};
