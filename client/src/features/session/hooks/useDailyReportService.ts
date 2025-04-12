import { useMemo } from 'react'
import { DailyReportRepository } from '../../../firebase/firestore/repositories/users/user-daily-report-repository'
import { toISODate } from '../../../functions/dateTime-utils/time-conversion'
import { useCurrentUserStore } from '../../../stores/currentUserStore'

const useDailyReportService = () => {
  const { uid } = useCurrentUserStore()
  const dailyReportRepo = useMemo(() => new DailyReportRepository(), [])
  const today = toISODate(Date.now())

  const getTodayReport = async () => {
    if (!uid) return null
    try {
      return await dailyReportRepo.getFirstMatch('date', today, [uid])
    } catch (error) {
      console.error('Error getting today report:', error)
      return null
    }
  }

  const handleAddStudyTime = async (studyTime: number) => {
    if (!uid) return
    const todayReport = await getTodayReport()

    console.log('todayReport', todayReport)

    if (!todayReport) {
      console.log("'create new report'")

      await dailyReportRepo.create({ date: today, studyTime }, [uid])
    } else {
      console.log('todayReport.studyTime', todayReport.studyTime)

      await dailyReportRepo.update(
        { studyTime: todayReport.studyTime + studyTime },
        todayReport.docId,
        [uid]
      )
    }
  }

  return {
    handleAddStudyTime,
    getTodayReport,
  }
}

export default useDailyReportService
