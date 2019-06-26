import * as Knex from 'knex';

export const knexConfig: Knex.Config = {
  client: 'sqlite3',
  connection: {
    dateStrings: true,
    filename: 'luftdaten.sqlite',
    timezone: 'Europe/Berlin',
  },
  debug: true,
  migrations: {
    directory: './knex/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './knex/seeds',
  },
  useNullAsDefault: true,
};
