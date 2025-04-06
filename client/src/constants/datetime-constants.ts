import { TimeSizeUnit } from '../types/datetime-types'

export const SECONDS_IN_MILLISECOND = 1000
export const MINUTES_IN_MILLISECOND = SECONDS_IN_MILLISECOND * 60
export const HOURS_IN_MILLISECOND = MINUTES_IN_MILLISECOND * 60
export const DAYS_IN_MILLISECOND = HOURS_IN_MILLISECOND * 24
export const YEARS_IN_MILLISECOND = DAYS_IN_MILLISECOND * 365

// 各単位のミリ秒数をマッピング
export const TIME_UNIT_IN_MILLISECONDS: Record<TimeSizeUnit, number> = {
  millis: 1,
  seconds: 1000, // SECONDS_IN_MILLISECOND
  minutes: 60 * 1000, // MINUTES_IN_MILLISECOND
  hours: 60 * 60 * 1000, // HOURS_IN_MILLISECOND
  days: 24 * 60 * 60 * 1000, // DAYS_IN_MILLISECOND
  years: 365 * 24 * 60 * 60 * 1000, // YEARS_IN_MILLISECOND
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
