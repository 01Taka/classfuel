import { Timestamp } from 'firebase/firestore'
import {
  BaseDocumentRead,
  BaseDocumentWrite,
} from '../../firestore-document-types'

interface TeamData {
  name: string // グループ名
  createdAt: Timestamp // 作成日時
  memberCount: number // キャッシュとしてのメンバー数
  visibility: 'public' | 'private' // 公開グループかどうか（検索/参加制御用）
}

export type TeamRead = BaseDocumentRead & TeamData
export type TeamWrite = BaseDocumentWrite & TeamData
