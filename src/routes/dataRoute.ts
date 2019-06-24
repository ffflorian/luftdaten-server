import * as express from 'express';
import * as Knex from 'knex';

import {DevicePayload} from '../DevicePayload';
import {KnexResult, KnexUpdate, TABLE} from '../knex/KnexService';
import {buildDataFromPayload} from '../utils';

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

export const dataRoute = (knexInstance: Knex<KnexResult, KnexUpdate>) => {
  router.get('/data/humidity/?', async (req, res) => {
    const limit = getLimit(req.query.limit);
    const result = await knexInstance(TABLE.LUFTDATEN)
      .select('created_at', 'humidity')
      .orderBy('created_at', 'desc')
      .limit(limit);
    return res.json(result);
  });

  router.get('/data/temperature/?', async (req, res) => {
    const limit = getLimit(req.query.limit);
    const result = await knexInstance(TABLE.LUFTDATEN)
      .select('created_at', 'temperature')
      .orderBy('created_at', 'desc')
      .limit(limit);
    return res.json(result);
  });

  router.get('/data/latest/?', async (req, res) => {
    const limit = getLimit(req.query.limit);
    const result = await knexInstance(TABLE.LUFTDATEN)
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(limit);
    return res.json(result);
  });

  router.get('/data/:id', async (req, res) => {
    const requestId = req.params.id;
    const result = await knexInstance(TABLE.LUFTDATEN)
      .select('*')
      .where({id: requestId});

    if (result.length) {
      return res.json(result[0]);
    }

    return res.sendStatus(404);
  });

  router.post('/data/?', async (req, res) => {
    const payload: DevicePayload = req.body;

    const data = buildDataFromPayload(payload);

    await knexInstance(TABLE.LUFTDATEN).insert(data);

    return res.sendStatus(200);
  });

  return router;
};
