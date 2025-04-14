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

  protected filterWriteData(data: TeamWrite): TeamWrite {
    const { name, createdAt, memberCount, visibility } = data
    return { name, createdAt, memberCount, visibility }
  }

  protected filterPartialWriteData(
    data: Partial<TeamWrite>
  ): Partial<TeamWrite> {
    const { name, createdAt, memberCount, visibility } = data
    return { name, createdAt, memberCount, visibility }
  }
}
