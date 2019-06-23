//@ts-check

const TABLE_NAME = 'luftdaten';

/**
 * @param {import('knex')} knexInstance
 */
const upMigration = async knexInstance => {
  const hasTable = await knexInstance.schema.hasTable(TABLE_NAME);

  if (!hasTable) {
    return knexInstance.schema.createTable(TABLE_NAME, table => {
      table
        .increments('id')
        .primary()
        .unsigned();
      table.float('humidity').nullable();
      table.float('SDS_P1').nullable();
      table.float('SDS_P2').nullable();
      table.float('temperature').nullable();
      table.integer('max_micro').nullable();
      table.integer('min_micro').nullable();
      table.integer('samples').nullable();
      table.integer('signal').nullable();
      table.string('esp8266id').notNullable();
      table.string('software_version').notNullable();
      table.timestamps(true, true);
    });
  }
};

/**
 * @param {import('knex')} knex
 * @param {PromiseConstructor} promise
 */
const downMigration = (knex, promise) => {
  return promise.all([knex.schema.dropTableIfExists(TABLE_NAME)]);
};

module.exports = {
  down: downMigration,
  up: upMigration,
};
