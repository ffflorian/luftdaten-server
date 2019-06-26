import * as express from 'express';
import * as Knex from 'knex';

import {Spec} from 'swagger-schema-official';
import {DevicePayload} from '../DevicePayload';
import {KnexResult, KnexUpdate, TABLE} from '../knex/KnexService';
import {buildDataFromPayload, getTimeZonedResult} from '../utils';

const router = express.Router();

const getLimit = (limitString?: string, maximum = 1000): number => {
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
    const limit = getLimit(req.query.limit);
    const result = await knexInstance(TABLE.LUFTDATEN)
      .select('created_at', 'humidity')
      .orderBy('created_at', 'desc')
      .limit(limit);
    return res.json(result);
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
        '200': {
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
    },
  };

  router.get('/data/temperature/?', async (req, res) => {
    const limit = getLimit(req.query.limit);
    const result = await knexInstance(TABLE.LUFTDATEN)
      .select('created_at', 'temperature')
      .orderBy('created_at', 'desc')
      .limit(limit);
    return res.json(getTimeZonedResult(result));
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
        '200': {
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
    },
  };

  router.get('/data/sds_p1/?', async (req, res) => {
    const limit = getLimit(req.query.limit);
    const result = await knexInstance(TABLE.LUFTDATEN)
      .select('created_at', 'SDS_P1')
      .orderBy('created_at', 'desc')
      .limit(limit);
    return res.json(getTimeZonedResult(result));
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
        '200': {
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
    },
  };

  router.get('/data/sds_p2/?', async (req, res) => {
    const limit = getLimit(req.query.limit);
    const result = await knexInstance(TABLE.LUFTDATEN)
      .select('created_at', 'SDS_P2')
      .orderBy('created_at', 'desc')
      .limit(limit);
    return res.json(getTimeZonedResult(result));
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
        '200': {
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
    },
  };

  router.get('/data/latest/?', async (req, res) => {
    const limit = getLimit(req.query.limit);
    const result = await knexInstance(TABLE.LUFTDATEN)
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(limit);
    return res.json(getTimeZonedResult(result));
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
        '200': {
          description: '',
          schema: {
            items: {
              $ref: '#/definitions/AllSchemas',
            },
            type: 'array',
          },
        },
      },
    },
  };

  router.get('/data/:id', async (req, res) => {
    const requestId = req.params.id;
    const result = await knexInstance(TABLE.LUFTDATEN)
      .select('*')
      .where({id: requestId});

    if (result.length) {
      return res.json(getTimeZonedResult(result)[0]);
    }

    return res.sendStatus(404);
  });

  swaggerDocument.paths['/data/{id}'] = {
    get: {
      parameters: [
        {
          description: '',
          in: 'path',
          name: 'id',
          required: true,
          type: 'integer',
        },
      ],
      produces: ['application/json'],
      responses: {
        '200': {
          description: '',
          schema: {
            $ref: '#/definitions/AllSchemas',
          },
        },
      },
    },
  };

  router.post('/data/?', async (req, res) => {
    const payload: DevicePayload = req.body;

    const data = buildDataFromPayload(payload);

    await knexInstance(TABLE.LUFTDATEN).insert(data);

    return res.sendStatus(200);
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
            $ref: '#/definitions/AllSchemas',
          },
        },
      ],
      responses: {
        '200': {
          description: 'Data is ok',
        },
      },
    },
  };

  return router;
};
