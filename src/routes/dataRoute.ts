import * as express from 'express';
import * as Knex from 'knex';

import {DevicePayload} from '../DevicePayload';
import {KnexResult, KnexUpdate, TABLE} from '../knex/KnexService';
import {buildDataFromPayload} from '../utils';

const router = express.Router();

export const dataRoute = (knexInstance: Knex<KnexUpdate, KnexResult>) => {
  return router.post('/data/?', async (req, res, next) => {
    const payload: DevicePayload = req.body;

    const data = buildDataFromPayload(payload);

    await knexInstance(TABLE.LUFTDATEN)
      .returning('id')
      .insert(data);

    return res.sendStatus(200);
  });
};
