import {
  BaseDocumentRead,
  BaseDocumentWrite,
} from '../../firestore-document-types'
import { Visibility } from '../../util-document-types'

interface VoiceMessageData {
  userId: string
  audioUrl: string
  visibility: Visibility
}

export type VoiceMessageRead = BaseDocumentRead & VoiceMessageData
export type VoiceMessageWrite = BaseDocumentWrite & VoiceMessageData
