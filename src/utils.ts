import {format, formatDistance} from 'date-fns';

import {DevicePayload, SensorValue} from './DevicePayload';
import {KnexResult, KnexUpdate} from './knex/KnexService';

export function formatDate(): string {
  return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
}

export function formatUptime(uptime: number): string {
  return formatDistance(0, uptime * 1000, {includeSeconds: true});
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

export function fixTimeZone(entries: Array<Partial<KnexResult>>): Array<Partial<KnexResult>> {
  return entries.map(entry => {
    if (entry.created_at) {
      const creationDate = new Date(`${entry.created_at} GMT`);
      entry.created_at = format(creationDate, 'yyyy-MM-dd HH:mm:ss');
    }
    if (entry.updated_at) {
      const updateDate = new Date(`${entry.updated_at} GMT`);
      entry.updated_at = format(updateDate, 'yyyy-MM-dd HH:mm:ss');
    }
    return entry;
  });
}
