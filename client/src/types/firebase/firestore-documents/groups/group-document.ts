import { Timestamp } from 'firebase/firestore'
import {
  BaseDocumentRead,
  BaseDocumentWrite,
} from '../../firestore-document-types'

interface GroupData {
  name: string // グループ名
  description?: string // 任意の説明文
  createdAt: Timestamp // 作成日時
  memberCount: number // キャッシュとしてのメンバー数
  visibility: 'public' | 'private' // 公開グループかどうか（検索/参加制御用）
}

export type GroupRead = BaseDocumentRead & GroupData
export type GroupWrite = BaseDocumentWrite & GroupData
