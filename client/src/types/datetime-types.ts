import { Timestamp } from 'firebase/firestore'
import { DecimalDight } from './number-types'

export type Month = `0${DecimalDight}` | '10' | '11' | '12'
export type Days =
  | `0${DecimalDight}`
  | `1${DecimalDight}`
  | `2${DecimalDight}`
  | '30'
  | '31'
export type Hours24 =
  | `0${DecimalDight}`
  | `1${DecimalDight}`
  | '20'
  | '21'
  | '22'
  | '23'
export type ISODate = `${string}-${Month}-${Days}`
export type ISODateTime = `${ISODate}T${string}Z`

export type Week =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export type TimeType = number | Timestamp | Date | ISODate | ISODateTime

export type TimeSizeUnit =
  | 'millis'
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'years'
