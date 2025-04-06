import FirestoreService from '../../handler/firestore-service'
import {
  UserRead,
  UserWrite,
} from '../../../../types/firebase/firestore-documents/user/user-document'
import { db } from '../../../firebase'

export class UserRepository extends FirestoreService<UserRead, UserWrite> {
  constructor() {
    super(db, ['users'])
  }

  protected filterWriteData(data: UserWrite): UserWrite {
    const { displayName, birthdate, gender } = data
    return { displayName, birthdate, gender }
  }

  protected filterPartialWriteData(
    data: Partial<UserWrite>
  ): Partial<UserWrite> {
    const { displayName, birthdate, gender } = data
    return { displayName, birthdate, gender }
  }
}
