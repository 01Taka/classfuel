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

  protected filterWriteData<T extends GroupWrite | Partial<GroupWrite>>(
    data: T
  ): T extends GroupWrite ? GroupWrite : Partial<GroupWrite> {
    const { name, createdAt, memberCount, visibility } = data
    return { name, createdAt, memberCount, visibility } as any
  }
}
