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

  protected filterCreateData(data: TeamWrite): TeamWrite {
    const { name } = data
    return { name }
  }

  protected filterUpdateData(data: Partial<TeamWrite>): Partial<TeamWrite> {
    const { name } = data
    return { name }
  }
}
