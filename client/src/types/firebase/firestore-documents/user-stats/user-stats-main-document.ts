import { FieldValue, Timestamp } from 'firebase/firestore'
import {
  BaseDocumentRead,
  BaseDocumentWrite,
  RemoveFieldValue,
} from '../../firestore-document-types'

interface UserStatsMainData {
  streak: number | FieldValue
  streakHP: number | FieldValue
  lastStudyTimestamp: Timestamp | null | FieldValue
  daysStudiedSinceLastHPUse: number | FieldValue
  expShort: number
  expLong: number
}

export type UserStatsMainRead = BaseDocumentRead &
  RemoveFieldValue<UserStatsMainData>
export type UserStatsMainWrite = BaseDocumentWrite & UserStatsMainData
