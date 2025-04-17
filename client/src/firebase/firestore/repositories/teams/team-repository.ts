import FirestoreService from '../../handler/firestore-service'
import { db } from '../../../firebase'
import {
  TeamRead,
  TeamWrite,
} from '../../../../types/firebase/firestore-documents/teams/team-document'

export class TeamRepository extends FirestoreService<TeamRead, TeamWrite> {
  constructor() {
    super(db, ['teams'])
  }

  protected filterWriteData<T extends TeamWrite | Partial<TeamWrite>>(
    data: T
  ): T extends TeamWrite ? TeamWrite : Partial<TeamWrite> {
    const { name, codeId } = data
    return { name, codeId } as any
  }
}
