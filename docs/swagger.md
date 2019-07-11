# Luftdaten
Receive and display data from your luftdaten device

## Version: 1.0

### /data/humidity

#### GET
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| limit | query |  | No | integer |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 |  | [ [CreatedAt](#createdat) & [Humidity](#humidity) ] |

### /data/temperature

#### GET
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| limit | query |  | No | integer |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 |  | [ [CreatedAt](#createdat) & [Temperature](#temperature) ] |

### /data/sds_p1

#### GET
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| limit | query |  | No | integer |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 |  | [ [CreatedAt](#createdat) & [SDS_P1](#sds_p1) ] |

### /data/sds_p2

#### GET
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| limit | query |  | No | integer |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 |  | [ [CreatedAt](#createdat) & [SDS_P2](#sds_p2) ] |

### /data/latest

#### GET
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| limit | query |  | No | integer |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 |  | [ [AllLuftdatenDefinitions](#allluftdatendefinitions) ] |

### /data/{id}

#### GET
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path |  | Yes | integer |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 |  | [AllLuftdatenDefinitions](#allluftdatendefinitions) |

### /data

#### POST
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| body | body |  | Yes | [AllLuftdatenDefinitions](#allluftdatendefinitions) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Data is ok |

### /commit

#### GET
##### Summary:

Get the latest commit hash as plain text

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 |  | string |

### /

#### GET
##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 |  | [ServerInfo](#serverinfo) |

### Models


#### AllLuftdatenDefinitions

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| AllLuftdatenDefinitions | object |  |  |

#### CreatedAt

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| created_at | dateTime |  | No |

#### Esp8266id

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| esp8266id | string |  | No |

#### Humidity

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| humidity | float |  | No |

#### Id

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| created_at | dateTime |  | No |

#### MaxMicro

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| max_micro | integer |  | No |

#### MinMicro

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| min_micro | integer |  | No |

#### Samples

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| samples | integer |  | No |

#### SDS_P1

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| SDS_P1 | float |  | No |

#### SDS_P2

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| SDS_P2 | float |  | No |

#### ServerInfo

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | integer |  | Yes |
| commit | string |  | No |
| message | string |  | Yes |
| uptime | string |  | Yes |

#### Signal

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| signal | integer |  | No |

#### SoftwareVersion

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| esp8266id | string |  | No |

#### Temperature

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| temperature | float |  | No |

#### UpdatedAt

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| updated_at | dateTime |  | No |