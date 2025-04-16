import {
  BaseDocumentRead,
  BaseDocumentWrite,
} from '../../firestore-document-types'

interface UserJoinedTeamData {
  name: string
}

export type UserJoinedTeamRead = BaseDocumentRead & UserJoinedTeamData
export type UserJoinedTeamWrite = BaseDocumentWrite & UserJoinedTeamData
