import FirestoreService from '../../handler/firestore-service'
import { db } from '../../../firebase'
import {
  TeamMemberRead,
  TeamMemberWrite,
} from '../../../../types/firebase/firestore-documents/teams/team-member-document'

export class TeamMemberRepository extends FirestoreService<
  TeamMemberRead,
  TeamMemberWrite
> {
  constructor() {
    super(db, ['teams', 'members'])
  }

  protected filterCreateData(data: TeamMemberWrite): TeamMemberWrite {
    const { displayName, iconUrl, session, todayStudyTime } = data
    return { displayName, iconUrl, session, todayStudyTime }
  }

  protected filterUpdateData(
    data: Partial<TeamMemberWrite>
  ): Partial<TeamMemberWrite> {
    const { displayName, iconUrl, session, todayStudyTime } = data
    return { displayName, iconUrl, session, todayStudyTime }
  }
}
