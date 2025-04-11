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

  protected filterWriteData(data: DailyReportWrite): DailyReportWrite {
    const { date, studyTime } = data
    return { date, studyTime }
  }

  protected filterPartialWriteData(
    data: Partial<DailyReportWrite>
  ): Partial<DailyReportWrite> {
    const { date, studyTime } = data
    return { date, studyTime }
  }
}
