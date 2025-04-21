import {
  BaseDocumentRead,
  BaseDocumentWrite,
} from '../../firestore-document-types'

interface UserStatsMainData {
  streak: number
  streakHP: number
  lastStudyDate: string
  daysStudiedSinceLastHPUse: number
  expShort: number
  expLong: number
}

export type UserStatsMainRead = BaseDocumentRead & UserStatsMainData
export type UserStatsMainWrite = BaseDocumentWrite & UserStatsMainData
