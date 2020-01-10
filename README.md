# luftdaten-server [![Build Status](https://github.com/ffflorian/luftdaten-server/workflows/Build/badge.svg)](https://github.com/ffflorian/luftdaten-server/actions/) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=ffflorian/luftdaten-server)](https://dependabot.com)

Receive and serve data from your [luftdaten](https://luftdaten.info) device.

## Usage

```
yarn
yarn start
```

In your device config, set the values for own API:

```
Server: <luftdaten-server IP/URL>
Path: /data
Port: 21080
```

Your data will be saved to **`luftdaten.sqlite`**.

## Incoming example data

```json
{
  "esp8266id": "1234567",
  "sensordatavalues": [
    {"value_type": "humidity", "value": "37.10"},
    {"value_type": "max_micro", "value": "2780073"},
    {"value_type": "min_micro", "value": "75"},
    {"value_type": "samples", "value": "1737810"},
    {"value_type": "SDS_P1", "value": "4.05"},
    {"value_type": "SDS_P2", "value": "2.25"},
    {"value_type": "signal", "value": "-86"},
    {"value_type": "temperature", "value": "28.90"}
  ],
  "software_version": "NRZ-2018-123B"
}
```

## REST API

See [the Swagger docs](./docs/swagger.md) or open [`/swagger-ui`](http://localhost:21080/swagger-ui) in your browser.

## Displaying the data

To display the data, check out [luftdaten-site](https://github.com/ffflorian/luftdaten-site).
