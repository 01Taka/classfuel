import FirestoreService from '../../handler/firestore-service'
import { db } from '../../../firebase'
import {
  GroupRead,
  GroupWrite,
} from '../../../../types/firebase/firestore-documents/groups/group-document'

export class GroupRepository extends FirestoreService<GroupRead, GroupWrite> {
  constructor() {
    super(db, ['groups'])
  }

  protected filterCreateData(data: GroupWrite): GroupWrite {
    const { name, createdAt, memberCount, visibility } = data
    return { name, createdAt, memberCount, visibility }
  }

  protected filterUpdateData(data: Partial<GroupWrite>): Partial<GroupWrite> {
    const { name, createdAt, memberCount, visibility } = data
    return { name, createdAt, memberCount, visibility }
  }
}
