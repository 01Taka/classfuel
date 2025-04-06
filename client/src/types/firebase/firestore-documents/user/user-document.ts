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
  friendIds: string[]
  mutualFollows: string[]
}

export type UserRead = BaseDocumentRead & UserData
export type UserWrite = BaseDocumentWrite & UserData
