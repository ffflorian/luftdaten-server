import * as express from 'express';
import * as Knex from 'knex';

import {inspect} from 'util';
import {KnexResult, KnexUpdate, TABLE} from '../knex/KnexService';

const router = express.Router();

export const dataRoute = (knexInstance: Knex<KnexUpdate, KnexResult>) => {
  return router.get('/', async (req, res) => {
    const entries: KnexResult[] = await knexInstance
      .from(TABLE.LUFTDATEN)
      .select('*')
      .limit(20);
    const str = entries.map(entry => inspect(entry, {breakLength: Infinity, depth: Infinity, sorted: true}));
    res.send(str);
  });
};
