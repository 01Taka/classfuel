import {
  BaseDocumentRead,
  BaseDocumentWrite,
} from '../../firestore-document-types'
import { UserSession } from '../users/user-document'

export interface TeamMemberData {
  displayName: string // グループ内で表示する名前（ユーザー側からコピー）
  iconUrl: string // プロフィール画像URL
  session: UserSession | null
  todayStudyTime: number // 当日の勉強時間（ランキング用キャッシュ）
}

export type TeamMemberRead = BaseDocumentRead & TeamMemberData
export type TeamMemberWrite = BaseDocumentWrite & TeamMemberData
