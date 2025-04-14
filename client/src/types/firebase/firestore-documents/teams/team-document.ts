import { FieldValue } from 'firebase/firestore'
import {
  BaseDocument,
  BaseDocumentRead,
  BaseDocumentWrite,
} from '../../firestore-document-types'

export interface TeamRead extends BaseDocumentRead {
  name: string // グループ名
  memberCount: number // キャッシュとしてのメンバー数
}

export interface TeamWrite extends BaseDocumentWrite {
  name: string
  isIncrementMemberCount?: boolean // メンバー数をインクリメントするかどうか
}

export interface TeamDocument extends BaseDocument {
  name: string // グループ名
  memberCount: number | FieldValue // キャッシュとしてのメンバー数
}
