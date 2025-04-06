import {
  BaseDocumentRead,
  BaseDocumentWrite,
} from '../../firestore-document-types'
import { Visibility } from '../../util-document-types'

interface VoiceMessageData {
  audioUrl: string
  visibility: Visibility
  likes: number
}

export type VoiceMessageRead = BaseDocumentRead & VoiceMessageData
export type VoiceMessageWrite = BaseDocumentWrite & VoiceMessageData
