import * as moment from 'moment';

import {DevicePayload, SensorValue} from './DevicePayload';
import {KnexResult, KnexUpdate} from './knex/KnexService';

export function formatDate(): string {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}

export function formatUptime(uptime: number): string {
  const duration = moment.duration(uptime, 'seconds').asMilliseconds();
  return moment.utc(duration).format('HH:mm:ss');
}

export function buildDataFromPayload(payload: DevicePayload): KnexUpdate {
  const sensorValues = buildValuesFromSensor(payload.sensordatavalues);

  const data: KnexUpdate = {
    esp8266id: payload.esp8266id,
    humidity: getFloatOrNull(sensorValues.humidity),
    max_micro: getIntOrNull(sensorValues.max_micro),
    min_micro: getIntOrNull(sensorValues.min_micro),
    samples: getIntOrNull(sensorValues.samples),
    SDS_P1: getFloatOrNull(sensorValues.SDS_P1),
    SDS_P2: getFloatOrNull(sensorValues.SDS_P2),
    signal: getIntOrNull(sensorValues.signal),
    software_version: payload.software_version,
    temperature: getFloatOrNull(sensorValues.temperature),
  };

  return data;
}

export function buildValuesFromSensor(values: SensorValue[]): Record<string, string> {
  return values.reduce((result: Record<string, string>, obj) => {
    result[obj.value_type] = obj.value;
    return result;
  }, {});
}

export function getIntOrNull(value: string): number | null {
  let result = null;

  try {
    result = parseInt(value, 10);
    if (isNaN(result)) {
      result = null;
    }
  } catch (error) {}

  return result;
}

export function getFloatOrNull(value: string): number | null {
  let result = null;

  try {
    result = parseFloat(value);
    if (isNaN(result)) {
      result = null;
    }
  } catch (error) {}

  return result;
}

export function fixTimeZone<T extends keyof KnexResult>(
  entries: Array<Pick<KnexResult, T | 'created_at'>>
): Array<Pick<KnexResult, T | 'created_at'>> {
  return entries.map(entry => {
    entry.created_at = moment.utc(entry.created_at, 'YYYY-MM-DD HH:mm:ss').toLocaleString();
    return entry;
  });
}
