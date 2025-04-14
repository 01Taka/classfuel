import FirestoreService from '../../handler/firestore-service'

import { db } from '../../../firebase'
import {
  VoiceMessageRead,
  VoiceMessageWrite,
} from '../../../../types/firebase/firestore-documents/voice-message/voice-message-document'

export class VoiceMessageRepository extends FirestoreService<
  VoiceMessageRead,
  VoiceMessageWrite
> {
  constructor() {
    super(db, ['voiceMessages'])
  }

  protected filterCreateData(data: VoiceMessageWrite): VoiceMessageWrite {
    const { audioPath, visibility, likes } = data
    return { audioPath, visibility, likes }
  }

  protected filterUpdateData(
    data: Partial<VoiceMessageWrite>
  ): Partial<VoiceMessageWrite> {
    const { audioPath, visibility, likes } = data
    return { audioPath, visibility, likes }
  }
}
