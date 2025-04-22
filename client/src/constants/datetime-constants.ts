import { TimeSizeUnit } from '../types/datetime-types'

export const SECONDS_IN_MS = 1000
export const MINUTES_IN_MS = SECONDS_IN_MS * 60
export const HOURS_IN_MS = MINUTES_IN_MS * 60
export const DAYS_IN_MS = HOURS_IN_MS * 24
export const YEARS_IN_MS = DAYS_IN_MS * 365

// 各単位のミリ秒数をマッピング
export const TIME_UNIT_IN_MSS: Record<TimeSizeUnit, number> = {
  millis: 1,
  seconds: 1000, // SECONDS_IN_MS
  minutes: 60 * 1000, // MINUTES_IN_MS
  hours: 60 * 60 * 1000, // HOURS_IN_MS
  days: 24 * 60 * 60 * 1000, // DAYS_IN_MS
  years: 365 * 24 * 60 * 60 * 1000, // YEARS_IN_MS
}

export const DIGIT_SIZE: Record<TimeSizeUnit, number> = {
  millis: 1000,
  seconds: 60,
  minutes: 60,
  hours: 24,
  days: 365,
  years: 1,
}

export enum WeekEnum {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}
