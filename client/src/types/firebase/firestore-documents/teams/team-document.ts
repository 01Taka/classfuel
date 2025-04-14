import {
  BaseDocument,
  BaseDocumentRead,
  BaseDocumentWrite,
} from '../../firestore-document-types'

interface TeamData {
  name: string // グループ名
  memberCount: number // キャッシュとしてのメンバー数
}

export interface TeamWrite extends BaseDocumentWrite {
  name: string
}

export type TeamRead = BaseDocumentRead & TeamData
export type TeamDocument = TeamData & BaseDocument
