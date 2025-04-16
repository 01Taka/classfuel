import FirestoreService from '../../handler/firestore-service'
import {
  UserRead,
  UserWrite,
} from '../../../../types/firebase/firestore-documents/users/user-document'
import { db } from '../../../firebase'

export class UserRepository extends FirestoreService<UserRead, UserWrite> {
  constructor() {
    super(db, ['users'])
  }

  protected filterWriteData<T extends UserWrite | Partial<UserWrite>>(
    data: T
  ): T extends UserWrite ? UserWrite : Partial<UserWrite> {
    const {
      displayName,
      birthdate,
      gender,
      friendIds,
      session,
      participatingTeamIds,
    } = data
    return {
      displayName,
      birthdate,
      gender,
      friendIds,
      session,
      participatingTeamIds,
    } as any
  }
}
