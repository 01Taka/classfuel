import { Timestamp } from 'firebase/firestore'
import {
  MINUTES_IN_MILLISECOND,
  TIME_UNIT_IN_MILLISECONDS,
} from '../../constants/datetime-constants'
import {
  ISODate,
  ISODateTime,
  TimeType,
  TimeSizeUnit,
} from '../../types/datetime-types'

/**
 * ISO形式の日付文字列をDateオブジェクトに変換します。
 * @param isoDate - ISO形式の日付文字列 (例: "2025-02-17")
 * @returns 有効なDateオブジェクト、無効な場合はnull
 */
const parseISODate = (isoDate: ISODate): Date | null => {
  const date = new Date(`${isoDate}T00:00:00Z`)
  return isNaN(date.getTime()) ? null : date
}

/**
 * ISO形式の日時文字列をDateオブジェクトに変換します。
 * @param isoDateTime - ISO形式の日時文字列 (例: "2025-02-17T12:34:56Z")
 * @returns 有効なDateオブジェクト、無効な場合はnull
 */
const parseISODateTime = (isoDateTime: ISODateTime): Date | null => {
  const date = new Date(isoDateTime)
  return isNaN(date.getTime()) ? null : date
}

/**
 * 様々な形式の時間をDateオブジェクトに変換します。
 * @param time - 数値、Date、Timestamp、またはISO形式の文字列
 * @returns 有効なDateオブジェクト
 * @throws 無効な入力の場合はエラーをスローします
 */
export const convertToDate = (time: TimeType): Date => {
  if (typeof time === 'number' || time instanceof Date) return new Date(time)
  if (time instanceof Timestamp) return time.toDate()

  if (typeof time === 'string') {
    let date: Date | null = null
    // "Z" で終わる文字列はISO形式の日時文字列として扱う
    if (time.endsWith('Z')) {
      date = parseISODateTime(time as ISODateTime)
    } else {
      date = parseISODate(time as ISODate)
    }
    if (!date) throw new Error(`Invalid ISO date string: ${time}`)
    return date
  }

  throw new Error(`Unsupported time type: ${typeof time}`)
}

export const convertToLocalTimeMs = (dateTime: TimeType): number => {
  const date = convertToDate(dateTime)
  return date.getTime() - date.getTimezoneOffset() * MINUTES_IN_MILLISECOND
}

export const getLocalDate = (baseDate: TimeType = new Date()) => {
  return new Date(convertToLocalTimeMs(baseDate))
}

/**
 * TimeType の入力をミリ秒に変換します。
 * @param time - 数値、Date、Timestamp、またはISO形式の文字列
 * @returns ミリ秒
 */
export const convertToMilliseconds = (time: TimeType): number => {
  return convertToDate(time).getTime()
}

/**
 * 入力された時間をISO形式の日付文字列 (YYYY-MM-DD) に変換します。
 * @param dateTime - 数値、Date、Timestamp、またはISO形式の文字列
 * @returns ISO形式の日付文字列
 */
export const toISODate = (dateTime: TimeType): ISODate => {
  const isoString = convertToDate(dateTime).toISOString()
  return isoString.slice(0, 10) as ISODate
}

/**
 * 入力された時間をISO形式の日時文字列に変換します。
 * @param dateTime - 数値、Date、Timestamp、またはISO形式の文字列
 * @returns ISO形式の日時文字列
 */
export const toISODateTime = (dateTime: TimeType): ISODateTime => {
  return convertToDate(dateTime).toISOString() as ISODateTime
}

/**
 * TimeType の入力を Timestamp オブジェクトに変換します。
 * @param input - 数値、Timestamp、またはDate
 * @returns 対応する Timestamp オブジェクト
 */
export const toTimestamp = (input: TimeType): Timestamp => {
  return Timestamp.fromDate(convertToDate(input))
}

/**
 * ミリ秒を指定した時間単位に変換する関数（切り上げ）
 * 例：ミリ秒を「minutes」単位に変換する場合、ms / TIME_UNIT_IN_MILLISECONDS["minutes"] を切り上げた値を返す。
 *
 * @param ms - ミリ秒
 * @param unit - 変換先の単位（デフォルトは "minutes"）
 * @returns 指定した単位に変換された数値
 */
export const convertMsToUnit = (
  ms: number,
  unit: TimeSizeUnit = 'minutes',
  decimalPlaces: number | null = 0
): number => {
  const unitInMs = TIME_UNIT_IN_MILLISECONDS[unit]
  if (decimalPlaces === null) {
    return ms / unitInMs
  }
  return parseFloat((ms / unitInMs).toFixed(decimalPlaces))
}

/**
 * 指定した時間単位に相当するミリ秒を返す関数
 *
 * @param unit - 時間単位
 * @returns 単位に相当するミリ秒
 */
export const getMsPerUnit = (unit: TimeSizeUnit): number => {
  return TIME_UNIT_IN_MILLISECONDS[unit]
}
