import { ISODate } from '../../../datetime-types'
import {
  BaseDocumentRead,
  BaseDocumentWrite,
} from '../../firestore-document-types'

export interface DailyReportData {
  date: ISODate // YYYY-MM-DD形式の日付
  studyTime: number // で記録
}

export type DailyReportRead = BaseDocumentRead & DailyReportData
export type DailyReportWrite = BaseDocumentWrite & DailyReportData
