/**
 * A sensor value, e.g.
 * `{ "value_type": "humidity", "value": "37.10" }`
 */
export interface SensorValue {
  value: string;
  /** The type of sensor, e.g. "humidity" */
  value_type: string;
}

export interface DevicePayload {
  /** The sensor ID */
  esp8266id: string;
  sensordatavalues: SensorValue[];
  /** Software version, e.g. `NRZ-2018-123B` */
  software_version: string;
}
