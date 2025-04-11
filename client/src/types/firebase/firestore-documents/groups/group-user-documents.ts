import { Timestamp } from 'firebase/firestore'
import {
  BaseDocumentRead,
  BaseDocumentWrite,
} from '../../firestore-document-types'

export interface GroupUserData {
  displayName: string // グループ内で表示する名前（ユーザー側からコピー）
  iconUrl?: string // プロフィール画像URL
  status: 'offline' | 'active' | 'studying' | 'on_break' | 'away' // 現在の状態（UI用）
  latestStudyTime?: number // 当日の勉強時間（ランキング用キャッシュ）
  joinedAt: Timestamp // このグループに参加した日時
}

export type GroupUserRead = BaseDocumentRead & GroupUserData
export type GroupUserWrite = BaseDocumentWrite & GroupUserData
