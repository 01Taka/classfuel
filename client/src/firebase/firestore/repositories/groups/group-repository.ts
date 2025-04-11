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

  protected filterWriteData(data: GroupWrite): GroupWrite {
    const { name, description, createdAt, memberCount, visibility } = data
    return { name, description, createdAt, memberCount, visibility }
  }

  protected filterPartialWriteData(
    data: Partial<GroupWrite>
  ): Partial<GroupWrite> {
    const { name, description, createdAt, memberCount, visibility } = data
    return { name, description, createdAt, memberCount, visibility }
  }
}
