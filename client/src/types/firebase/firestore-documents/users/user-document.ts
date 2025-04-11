import { Timestamp } from 'firebase/firestore'
import {
  BaseDocumentRead,
  BaseDocumentWrite,
} from '../../firestore-document-types'
import { Gender } from '../../util-document-types'

interface UserData {
  displayName: string
  birthdate: Timestamp
  gender: Gender
  session: UserSession | null // 現在のセッション情報（nullの場合はセッション中でない）
}

export interface UserSession {
  type: 'study' | 'break' // セッションの種別
  startedAt: Timestamp
  latestStartedAt: Timestamp
  expectedEndAt: Timestamp // ユーザーが設定した予定終了時刻
  stoppedAt: Timestamp | null // 途中で手動停止された場合に記録
  status: 'running' | 'stopped'
}

export type UserRead = BaseDocumentRead & UserData
export type UserWrite = BaseDocumentWrite & UserData
