import FirestoreService from '../../handler/firestore-service'
import { db } from '../../../firebase'
import {
  TeamCodeRead,
  TeamCodeWrite,
} from '../../../../types/firebase/firestore-documents/team-codes/team-codes-cocument'

export class TeamCodeRepository extends FirestoreService<
  TeamCodeRead,
  TeamCodeWrite
> {
  constructor() {
    super(db, ['teamCodes'])
  }

  protected filterWriteData<T extends TeamCodeWrite | Partial<TeamCodeWrite>>(
    data: T
  ): T extends TeamCodeWrite ? TeamCodeWrite : Partial<TeamCodeWrite> {
    const { teamId } = data
    return { teamId } as any
  }
}
