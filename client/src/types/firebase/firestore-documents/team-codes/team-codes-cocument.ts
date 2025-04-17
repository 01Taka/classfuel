import {
  BaseDocumentRead,
  BaseDocumentWrite,
} from '../../firestore-document-types'

export interface TeamCodeData {
  teamId: string
}

export type TeamCodeRead = BaseDocumentRead & TeamCodeData
export type TeamCodeWrite = BaseDocumentWrite & TeamCodeData
