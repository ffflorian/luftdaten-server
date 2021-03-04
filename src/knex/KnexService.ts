import {Knex, knex} from 'knex';
import {knexConfig} from './knexfile';

export enum TABLE {
  LUFTDATEN = 'luftdaten',
}

export interface KnexUpdate {
  esp8266id: string;
  humidity?: number | null;
  max_micro?: number | null;
  min_micro?: number | null;
  samples?: number | null;
  SDS_P1?: number | null;
  SDS_P2?: number | null;
  signal?: number | null;
  software_version: string;
  temperature?: number | null;
}

export interface KnexResult extends Required<KnexUpdate> {
  created_at: string;
  id: string;
  software_version: string;
  updated_at: string;
}

export interface KnexServiceOptions {
  development?: boolean;
}

export class KnexService {
  private readonly knex: Knex<KnexResult, KnexUpdate>;

  constructor(options: KnexServiceOptions = {}) {
    knexConfig.debug = options.development === true;

    this.knex = knex(knexConfig);
  }

  public async init(): Promise<Knex<KnexResult, KnexUpdate>> {
    try {
      await this.knex.migrate.latest();
      return this.knex;
    } catch (error) {
      throw new Error(`Error while migrating: ${error.message}`);
    }
  }
}
