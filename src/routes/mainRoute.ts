import * as express from 'express';
import * as Knex from 'knex';

import {KnexResult, KnexUpdate, TABLE} from '../knex/KnexService';

const router = express.Router();

export const mainRoute = (knexInstance: Knex<KnexUpdate, KnexResult>) => {
  return router.get('/', async (req, res) => {
    const result: KnexResult[] = await knexInstance
      .from(TABLE.LUFTDATEN)
      .select('*')
      .limit(20);
    const entries: Array<{values: string[]}> = result.map(entry => ({values: Object.values(entry)}));
    const headers = Object.keys(result[0]);
    res.render('main', {entries, headers});
  });
};
