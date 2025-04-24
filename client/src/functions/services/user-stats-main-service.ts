import { UserStatsMainRepository } from '../../firebase/firestore/repositories/user-stats/user-stats-main-repository'
import {
  UserStatsMainRead,
  UserStatsMainWrite,
} from '../../types/firebase/firestore-documents/user-stats/user-stats-main-document'
import { getDayOffsetFromBase } from '../dateTime-utils/datetime-utils'
import { increment, serverTimestamp } from 'firebase/firestore'
import { convertToDate } from '../dateTime-utils/time-conversion'
import { HOURS_IN_MS } from '../../constants/datetime-constants'
import { TimeType } from '../../types/datetime-types'
import { StatsUpdateDetails, TimeSlot } from '../../types/services/stats-types'
import {
  DAYS_TO_RECOVER_HP,
  LONG_MIN_TIME,
  LONG_SESSION_HOURLY_BONUS_RATE,
  LONG_SESSION_RATE,
  MAX_STREAK_HP,
  SHORT_MIN_TIME,
  SHORT_SESSION_INCREMENT,
  TIME_SLOT_BONUS,
} from '../../constants/stats-constants'

const userStatsMainRepo = new UserStatsMainRepository()

function getTimeSlot(date: Date): TimeSlot {
  const hour = date.getHours()

  if (hour >= 0 && hour < 3) return 'lateNight'
  if (hour >= 3 && hour < 6) return 'earlyMorning'
  if (hour >= 6 && hour < 9) return 'morning'
  if (hour >= 9 && hour < 12) return 'lateMorning'
  if (hour >= 12 && hour < 15) return 'afternoon'
  if (hour >= 15 && hour < 18) return 'evening'
  if (hour >= 18 && hour < 21) return 'earlyNight'
  return 'lateEvening'
}

export const progressStatsMainUpdate = async (
  uid: string,
  stats: UserStatsMainRead,
  durationMs: number
): Promise<StatsUpdateDetails> => {
  const result = prepareStatsUpdate(stats, durationMs)
  await userStatsMainRepo.update({ ...result.updates }, [uid])
  return result
}

const checkIfSameTimeSlot = (lastStudyTimestamp: TimeType | null) => {
  if (!lastStudyTimestamp) return false
  const now = new Date()
  const lastStudyDate = convertToDate(lastStudyTimestamp)
  const currentSlot = getTimeSlot(now)
  const lastSlot = getTimeSlot(lastStudyDate)
  return currentSlot === lastSlot
}

export const prepareStatsUpdate = (
  stats: UserStatsMainRead,
  durationMs: number
): StatsUpdateDetails => {
  const isSameTimeSlot = checkIfSameTimeSlot(stats.lastStudyTimestamp)
  const isShortSession = durationMs >= SHORT_MIN_TIME
  const isLongSession = durationMs >= LONG_MIN_TIME

  const shortSessionBonus = isShortSession
    ? SHORT_SESSION_INCREMENT + (isSameTimeSlot ? TIME_SLOT_BONUS : 0)
    : 0

  const longSessionHourlyBonus = isLongSession
    ? Math.floor(durationMs / HOURS_IN_MS) *
      HOURS_IN_MS *
      LONG_SESSION_HOURLY_BONUS_RATE
    : 0

  const expShortGained = shortSessionBonus
  const expLongGained = isLongSession
    ? Math.floor(durationMs * LONG_SESSION_RATE + longSessionHourlyBonus)
    : 0

  const newExpShort = stats.expShort + expShortGained
  const newExpLong = stats.expLong + expLongGained

  const dateDiff = stats.lastStudyTimestamp
    ? getDayOffsetFromBase(stats.lastStudyTimestamp, 4)
    : null

  let newStreak = stats.streak
  let newStreakHP = stats.streakHP
  let newDaysStudied = stats.daysStudiedSinceLastHPUse

  const updates: Partial<UserStatsMainWrite> = {
    expShort: newExpShort,
    expLong: newExpLong,
  }

  if (dateDiff && dateDiff === 1) {
    updates.streak = increment(1)
    updates.lastStudyTimestamp = serverTimestamp()
    newStreak += 1

    if (stats.streakHP === MAX_STREAK_HP) {
      updates.daysStudiedSinceLastHPUse = 0
      newDaysStudied = 0
    } else if (stats.daysStudiedSinceLastHPUse + 1 === DAYS_TO_RECOVER_HP) {
      updates.daysStudiedSinceLastHPUse = 0
      updates.streakHP = increment(1)
      newStreakHP += 1
      newDaysStudied = 0
    } else {
      updates.daysStudiedSinceLastHPUse = increment(1)
      newDaysStudied += 1
    }
  } else if (dateDiff && dateDiff > 1) {
    const remainingHP = stats.streakHP - (dateDiff - 1)
    if (remainingHP >= 0) {
      updates.streakHP = increment(-dateDiff + 1)
      newStreakHP = remainingHP
    } else {
      updates.streak = 0
      newStreak = 0
    }
  }

  return {
    updates,
    newStats: {
      expShort: newExpShort,
      expLong: newExpLong,
      streak: newStreak,
      streakHP: newStreakHP,
      daysStudiedSinceLastHPUse: newDaysStudied,
    },
    details: {
      timeSlot: getTimeSlot(new Date()),
      isSameTimeSlot,
      shortSessionBonus,
      longSessionHourlyBonus,
      expShortGained,
      expLongGained,
    },
  }
}
