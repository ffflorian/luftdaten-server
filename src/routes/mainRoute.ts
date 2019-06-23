import * as express from 'express';
import * as Knex from 'knex';

import {KnexResult, KnexUpdate, TABLE} from '../knex/KnexService';

const router = express.Router();

export const mainRoute = (knexInstance: Knex<KnexResult, KnexUpdate>) => {
  return router.get('/', async (req, res) => {
    const result = await knexInstance(TABLE.LUFTDATEN)
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(20);
    const entries: Array<{values: string[]}> = result.map(entry => ({values: Object.values(entry)}));
    const headers = Object.keys(result[0]);
    return res.render('home', {entries, headers});
  });
};
