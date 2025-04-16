import FirestoreService from '../../handler/firestore-service'
import { db } from '../../../firebase'
import {
  UserJoinedTeamRead,
  UserJoinedTeamWrite,
} from '../../../../types/firebase/firestore-documents/users/user-joined-team-document'

export class UserJoinedTeamRepository extends FirestoreService<
  UserJoinedTeamRead,
  UserJoinedTeamWrite
> {
  constructor() {
    super(db, ['users', 'joinedTeams'])
  }

  protected filterWriteData<
    T extends UserJoinedTeamWrite | Partial<UserJoinedTeamWrite>,
  >(
    data: T
  ): T extends UserJoinedTeamWrite
    ? UserJoinedTeamWrite
    : Partial<UserJoinedTeamWrite> {
    const { name } = data
    return {
      name,
    } as any
  }
}
