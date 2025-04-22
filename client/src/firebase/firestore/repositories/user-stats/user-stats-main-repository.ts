import FirestoreService from '../../handler/firestore-service'
import { db } from '../../../firebase'
import {
  UserStatsMainRead,
  UserStatsMainWrite,
} from '../../../../types/firebase/firestore-documents/user-stats/user-stats-main-document'
import NamedDocumentService from '../../handler/named-document-service'

class UserStatsService extends FirestoreService<
  UserStatsMainRead,
  UserStatsMainWrite
> {
  constructor() {
    super(db, ['users', 'stats'])
  }

  protected filterWriteData<
    T extends UserStatsMainWrite | Partial<UserStatsMainWrite>,
  >(
    data: T
  ): T extends UserStatsMainWrite
    ? UserStatsMainWrite
    : Partial<UserStatsMainWrite> {
    const {
      streak,
      streakHP,
      lastStudyTimestamp,
      daysStudiedSinceLastHPUse,
      expShort,
      expLong,
    } = data
    return {
      streak,
      streakHP,
      lastStudyTimestamp,
      daysStudiedSinceLastHPUse,
      expShort,
      expLong,
    } as any
  }
}

export class UserStatsMainRepository extends NamedDocumentService<
  UserStatsMainRead,
  UserStatsMainWrite
> {
  constructor() {
    const service = new UserStatsService()
    super(service, 'main')
  }
}
