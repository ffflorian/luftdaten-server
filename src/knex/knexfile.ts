import type {Knex} from 'knex';

export const knexConfig: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './luftdaten.sqlite',
  },
  debug: false,
  migrations: {
    directory: './knex/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './knex/seeds',
  },
  useNullAsDefault: true,
};
