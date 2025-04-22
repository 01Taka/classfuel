import { differenceInDays } from 'date-fns'
import { getMidnightDate } from './datetime-utils'
import { MINUTES_IN_MS } from '../../constants/datetime-constants'
import { convertToMilliseconds, getMsPerUnit } from './time-conversion'
import { TimeType, TimeSizeUnit } from '../../types/datetime-types'

/**
 * フォーマット時のオプション
 */
export interface DurationFormatOptions {
  /** 時間部分を常に表示するか（デフォルト true） */
  showHours?: boolean
  /** 時間部分をゼロ埋めするか（デフォルト true） */
  padHours?: boolean
  /** 分部分を常に表示するか（デフォルト true） */
  showMinutes?: boolean
  /** 分部分をゼロ埋めするか（デフォルト true） */
  padMinutes?: boolean
  /** 秒部分を表示するか（デフォルト true） */
  showSeconds?: boolean
  /** 秒部分をゼロ埋めするか（デフォルト true） */
  padSeconds?: boolean
  /** 秒の小数点以下桁数（デフォルト 0、指定すると小数部付き） */
  fractionalDigits?: number
  /** 各単位間のセパレーター（デフォルト " : "） */
  separator?: string
  /** 単位ラベルを付与する場合（例: { hours: "時間", minutes: "分", seconds: "秒" }）<br>
   * 指定された場合はセパレーターではなく、各数値の後にラベルを付けて連結します。
   */
  unitLabels?: {
    hours?: string
    minutes?: string
    seconds?: string
  }
  /** 時間が0の場合は表示しないか（unitLabels指定時は false 推奨、デジタル形式時は true 推奨） */
  hideZeroHours?: boolean
}

/**
 * ミリ秒を分解して、時間、分、秒、ミリ秒を返す
 * @param ms - ミリ秒
 * @returns { hours, minutes, seconds, milliseconds } のオブジェクト
 */
export const decomposeMilliseconds = (
  ms: number
): {
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
} => {
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const milliseconds = ms % 1000
  return { hours, minutes, seconds, milliseconds }
}

type TimeUnit = 'hours' | 'minutes' | 'seconds' | 'milliseconds'

interface FormatOptions {
  display?: TimeUnit[] // 表示する順序
  delimiter?: string // 区切り文字
  units?: Partial<Record<TimeUnit, string>> // 単位記号（省略可）
}

export const formatDuration = (
  duration: number,
  options?: FormatOptions
): string => {
  const {
    display = ['hours', 'minutes'],
    delimiter = '',
    units = {},
  } = options ?? {}

  const decomposedTimes = decomposeMilliseconds(duration)

  return display
    .map((unit) => {
      const value = decomposedTimes[unit] ?? 0
      const suffix = units[unit] ?? ''
      return `${value}${suffix}`
    })
    .join(delimiter)
}

/**
 * ミリ秒の時間を省略表示する関数
 * 60分未満の場合は「min」、60分以上の場合は「h」（小数点1桁）で表示する。
 *
 * @param ms - ミリ秒
 * @param options - ラベルのカスタマイズオプション
 * @returns 省略フォーマットされた時間文字列
 */
export const formatAbbreviatedDuration = (
  ms: number,
  options?: Partial<{ minuteLabel: string; hourLabel: string }>
): string => {
  const minuteLabel = options?.minuteLabel ?? 'min'
  const hourLabel = options?.hourLabel ?? 'h'
  const totalMinutes = Math.floor(ms / MINUTES_IN_MS)
  if (totalMinutes >= 60) {
    const hours = (totalMinutes / 60).toFixed(1)
    return `${hours}${hourLabel}`
  } else {
    return `${totalMinutes}${minuteLabel}`
  }
}

/**
 * 指定した日付と基準日との日数差をフォーマットする関数
 * ・未来の場合はデフォルトで "d日後"、過去の場合は "d日前" と表示する。<br>
 * ・フォーマット文字列中の "d" が日数に置換される。
 *
 * @param targetDate - 比較対象の日付
 * @param options - フォーマット（futureFormat, pastFormat）や基準日（baseDate）のオプション
 * @returns フォーマットされた日付差文字列
 */
export const formatDayDifference = (
  targetDate: TimeType,
  options?: Partial<{
    futureFormat: string
    pastFormat: string
    baseDate: TimeType
  }>
): string => {
  const futureFormat = options?.futureFormat ?? 'd日後'
  const pastFormat = options?.pastFormat ?? 'd日前'
  const baseDate = options?.baseDate ?? new Date()

  const daysDifference = differenceInDays(
    getMidnightDate(targetDate),
    getMidnightDate(baseDate)
  )
  const formatStr = daysDifference < 0 ? pastFormat : futureFormat
  return formatStr.replace(/d/g, String(Math.abs(daysDifference)))
}

export const shiftDateTime = (
  base: TimeType,
  shift: number,
  unit: TimeSizeUnit
): number => {
  const ms = convertToMilliseconds(base) + getMsPerUnit(unit) * shift
  return ms
}

interface UnitLabels {
  hours?: string
  minutes?: string
  seconds?: string
}

export const formatTime = (
  ms: number,
  separator = ':',
  unitLabels?: UnitLabels
): string => {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const formatUnit = (value: number, unit?: string) =>
    unit ? `${value}${unit}` : value.toString()

  if (unitLabels) {
    const parts = []
    if (hours > 0) parts.push(formatUnit(hours, unitLabels.hours))
    if (minutes > 0 || hours > 0)
      parts.push(formatUnit(minutes, unitLabels.minutes))
    parts.push(formatUnit(seconds, unitLabels.seconds))
    return parts.join(' ')
  } else {
    if (hours > 0) {
      return `${hours}${separator}${minutes.toString().padStart(2, '0')}${separator}${seconds.toString().padStart(2, '0')}`
    } else if (minutes > 0) {
      return `${minutes}${separator}${seconds.toString().padStart(2, '0')}`
    } else {
      return `${seconds}`
    }
  }
}
