import { UserStatsMainWrite } from '../firebase/firestore-documents/user-stats/user-stats-main-document'

export interface StatsUpdateDetails {
  updates: Partial<UserStatsMainWrite>
  newStats: {
    expShort: number
    expLong: number
    streak: number
    streakHP: number
    daysStudiedSinceLastHPUse: number
  }
  details: {
    timeSlot: TimeSlot
    isSameTimeSlot: boolean
    shortSessionBonus: number
    longSessionHourlyBonus: number
    expShortGained: number
    expLongGained: number
  }
}

export type TimeSlot =
  | 'lateNight'
  | 'earlyMorning'
  | 'morning'
  | 'lateMorning'
  | 'afternoon'
  | 'evening'
  | 'earlyNight'
  | 'lateEvening'
