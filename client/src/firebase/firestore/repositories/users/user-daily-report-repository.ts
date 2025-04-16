import FirestoreService from '../../handler/firestore-service'
import { db } from '../../../firebase'
import {
  DailyReportRead,
  DailyReportWrite,
} from '../../../../types/firebase/firestore-documents/users/user-daily-report-document'

export class DailyReportRepository extends FirestoreService<
  DailyReportRead,
  DailyReportWrite
> {
  constructor() {
    super(db, ['users', 'dailyReports'])
  }

  protected filterWriteData<
    T extends DailyReportWrite | Partial<DailyReportWrite>,
  >(
    data: T
  ): T extends DailyReportWrite ? DailyReportWrite : Partial<DailyReportWrite> {
    const { date, studyTime } = data
    return { date, studyTime } as any
  }
}
