import * as express from 'express';
import * as Knex from 'knex';
import * as logdown from 'logdown';

import {DevicePayload} from '../DevicePayload';
import {KnexResult, KnexUpdate, TABLE} from '../knex/KnexService';
import {buildDataFromPayload} from '../utils';

const logger = logdown('luftdaten-server/dataRoute', {
  logger: console,
  markdown: false,
});

const router = express.Router();

export const dataRoute = (knexInstance: Knex<KnexResult, KnexUpdate>) => {
  router.get('/data/?', async (req, res) => {
    const result = await knexInstance(TABLE.LUFTDATEN)
      .select('*')
      .limit(20);
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

    logger.info('Received payload', payload);

    const data = buildDataFromPayload(payload);

    const ids = await knexInstance(TABLE.LUFTDATEN)
      .returning('id')
      .insert(data);

    logger.info('Saved to db with ids', ids);

    return res.sendStatus(200);
  });

  return router;
};
