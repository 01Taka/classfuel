import { format, startOfDay, isSameMinute, isBefore } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { convertToDate, convertToMilliseconds } from './time-conversion'
import { DAYS_IN_MILLISECOND } from '../../constants/datetime-constants'
import { Days, TimeType } from '../../types/datetime-types'

export const isMidnight = (dateTime: TimeType) => {
  const date = convertToDate(dateTime)
  const midnight = new Date(date)
  midnight.setHours(0, 0, 0, 0)
  return isSameMinute(date, midnight)
}

export const isMatchDay = (date: TimeType, targetDay: Days | Days[]) => {
  const formatDate = format(convertToDate(date), 'dd') as Days
  return typeof targetDay === 'string'
    ? formatDate === targetDay
    : targetDay.includes(formatDate)
}

export const isEqualDate = (...days: TimeType[]): boolean => {
  const check = convertToMilliseconds(startOfDay(convertToDate(days[0])))
  const isDiff = days.some(
    (day) => check !== convertToMilliseconds(startOfDay(convertToDate(day)))
  )
  return !isDiff
}

/**
 * 比較対象の日付が基準の日付よりも過去かを判断する
 * @param baseDateTime - 基準となる日付と時間
 * @param targetDateTime - 比較対象の日付と時間
 * @param includesEqual - 基準日付と等しい場合も含めるかどうか
 * @returns 比較結果（ターゲット日付が基準日付よりも過去の場合はtrue、そうでない場合はfalse）
 */
export const isBeforeDateTime = (
  baseDateTime: TimeType,
  dateTimeToCompare: TimeType = new Date(),
  includesEqual: boolean = false,
  convertToMidnight = false
) => {
  const baseDate = convertToMidnight
    ? getMidnightDate(baseDateTime)
    : convertToDate(baseDateTime)
  const dateToCompare = convertToMidnight
    ? getMidnightDate(dateTimeToCompare)
    : convertToDate(dateTimeToCompare)
  if (includesEqual && baseDate === dateToCompare) return true
  return isBefore(baseDate, dateToCompare)
}

/**
 * 特定の日付の0時0分のタイムスタンプを返します。
 * @param date 対象の日付
 * @returns 0時0分のタイムスタンプ
 */
export const getMidnightTimestamp = (
  date: TimeType = new Date()
): Timestamp => {
  return Timestamp.fromDate(getMidnightDate(date))
}

export const getMidnightDate = (date: TimeType = new Date()): Date => {
  const midnight = startOfDay(convertToDate(date))
  return midnight
}

/**
 * Set the hour of a Date object to the specified hour (0-24).
 * @param date - The original Date object.
 * @param hour - The hour to set (0-24).
 * @returns A new Date object with the updated hour.
 */
export const setHourToDate = (dateTime: TimeType, hour: number): Date => {
  if (hour < 0 || hour > 24) {
    throw new RangeError('Hour must be between 0 and 24.')
  }

  const updatedDate = convertToDate(dateTime)

  // Set the specified hour
  updatedDate.setHours(hour, 0, 0, 0)

  return updatedDate
}

/**
 * Calculate the difference in days between two dates.
 * @param date1 - The first date.
 * @param date2 - The second date.
 * @param updateHour - Optional hour when the date should update (default: 0).
 * @returns Number of days between date1 and date2.
 */
export const getDateDifference = (
  date1: TimeType,
  date2: TimeType,
  updateHour: number = 0
): number => {
  // Convert inputs to Date objects
  const d1 = convertToDate(date1)
  const d2 = convertToDate(date2)

  if (updateHour < 0 || updateHour > 24) {
    throw new RangeError('updateHour must be between 0 and 24.')
  }

  // Adjust date based on updateHour
  d1.setHours(d1.getHours() < updateHour ? -1 : 0, 0, 0, 0)
  d2.setHours(d2.getHours() < updateHour ? -1 : 0, 0, 0, 0)

  // Calculate difference in milliseconds and convert to days
  const diffTime = d2.getTime() - d1.getTime()
  return Math.round(diffTime / (1000 * 60 * 60 * 24))
}

export const getDayOffsetFromBase = (
  targetDate: TimeType,
  baseHour: number = 4
): number => {
  // 今日の日付を基準日として取得
  const now = new Date()
  const adjustMs = now.getHours() >= baseHour ? 0 : DAYS_IN_MILLISECOND
  const baseDate = now.setHours(baseHour, 0, 0, 0) - adjustMs

  // ターゲット日も基準時間を考慮した上で差分を計算
  const diffMs = convertToMilliseconds(targetDate) - baseDate

  // 差分日数を計算し、小数点以下は切り捨て
  return Math.floor(diffMs / DAYS_IN_MILLISECOND)
}
