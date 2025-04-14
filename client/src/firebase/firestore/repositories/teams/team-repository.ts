import FirestoreService from '../../handler/firestore-service'
import { db } from '../../../firebase'
import {
  TeamDocument,
  TeamRead,
  TeamWrite,
} from '../../../../types/firebase/firestore-documents/teams/team-document'
import { increment } from 'firebase/firestore'

export class TeamRepository extends FirestoreService<
  TeamRead,
  TeamWrite,
  TeamDocument
> {
  constructor() {
    super(db, ['teams'])
  }

  protected filterCreateData(data: TeamWrite): TeamDocument {
    const { name } = data
    return { name, memberCount: 0 }
  }

  protected filterUpdateData(data: Partial<TeamWrite>): Partial<TeamDocument> {
    const { name, isIncrementMemberCount } = data
    return {
      name,
      memberCount: isIncrementMemberCount ? increment(1) : undefined,
    }
  }
}
