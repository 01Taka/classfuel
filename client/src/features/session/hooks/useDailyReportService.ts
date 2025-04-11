import { useMemo } from 'react'
import { DailyReportRepository } from '../../../firebase/firestore/repositories/users/user-daily-report-repository'
import { toISODate } from '../../../functions/dateTime-utils/time-conversion'

const useDailyReportService = () => {
  const dailyReportRepo = useMemo(() => new DailyReportRepository(), [])
  const today = toISODate(Date.now())

  const getTodayReport = async () => {
    return await dailyReportRepo.getFirstMatch('date', today)
  }

  const handleAddStudyTime = async (studyTime: number) => {
    const todayReport = await getTodayReport()

    if (!todayReport) {
      await dailyReportRepo.create({ date: today, studyTime })
    } else {
      await dailyReportRepo.update(
        { studyTime: todayReport.studyTime + studyTime },
        todayReport.docId
      )
    }
  }

  return {
    handleAddStudyTime,
    getTodayReport,
  }
}

export default useDailyReportService
