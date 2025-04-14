import {
  BaseDocumentRead,
  BaseDocumentWrite,
} from '../../firestore-document-types'

export interface TeamData {
  name: string
}

export type TeamRead = BaseDocumentRead & TeamData
export type TeamWrite = BaseDocumentWrite & TeamData
