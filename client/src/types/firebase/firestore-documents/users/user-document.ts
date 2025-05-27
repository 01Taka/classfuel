import { FieldValue, Timestamp } from 'firebase/firestore'
import {
  BaseDocumentRead,
  BaseDocumentWrite,
  RemoveFieldValue,
} from '../../firestore-document-types'
import { Gender } from '../../util-document-types'

interface UserData {
  displayName: string
  birthdate: Timestamp
  gender: Gender
  activeTeamId: string | null
  session: UserSession | null // 現在のセッション情報（nullの場合はセッション中でない）
  status: UserStatus // ユーザーの総学習状況
}

export interface UserStatus {
  totalStudyDuration: number | FieldValue // ユーザーの総学習時間（ミリ秒単位）
}

export interface UserSession {
  type: 'study' | 'break' // セッションの種別
  startedAt: Timestamp
  latestStartedAt: Timestamp
  expectedEndAt: Timestamp // ユーザーが設定した予定終了時刻
  stoppedAt: Timestamp | null // 途中で手動停止された場合に記録
  expectedDuration: number // ユーザーが設定したセッションの長さ
  status: 'running' | 'stopped'
  elapsedDuration: number
}

// 最終的な型
export type UserRead = RemoveFieldValue<BaseDocumentRead & UserData>
export type UserWrite = BaseDocumentWrite & UserData
