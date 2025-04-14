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

  protected filterWriteData(data: TeamMemberWrite): TeamMemberWrite {
    const { displayName, iconUrl, joinedAt, session, todayStudyTime } = data
    return { displayName, iconUrl, joinedAt, session, todayStudyTime }
  }

  protected filterPartialWriteData(
    data: Partial<TeamMemberWrite>
  ): Partial<TeamMemberWrite> {
    const { displayName, iconUrl, joinedAt, session, todayStudyTime } = data
    return { displayName, iconUrl, joinedAt, session, todayStudyTime }
  }
}
