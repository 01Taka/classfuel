import FirestoreService from '../../handler/firestore-service'
import { db } from '../../../firebase'
import {
  GroupUserRead,
  GroupUserWrite,
} from '../../../../types/firebase/firestore-documents/groups/group-user-documents'

export class GroupUserRepository extends FirestoreService<
  GroupUserRead,
  GroupUserWrite
> {
  constructor() {
    super(db, ['groups', 'users'])
  }

  protected filterWriteData(data: GroupUserWrite): GroupUserWrite {
    const { displayName, iconUrl, status, latestStudyTime, joinedAt } = data
    return { displayName, iconUrl, status, latestStudyTime, joinedAt }
  }

  protected filterPartialWriteData(
    data: Partial<GroupUserWrite>
  ): Partial<GroupUserWrite> {
    const { displayName, iconUrl, status, latestStudyTime, joinedAt } = data
    return { displayName, iconUrl, status, latestStudyTime, joinedAt }
  }
}
