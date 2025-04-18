import { DailyReportRepository } from '../../../firebase/firestore/repositories/users/user-daily-report-repository'
import {
  getLocalDate,
  toISODate,
} from '../../../functions/dateTime-utils/time-conversion'
import { useCurrentUserStore } from '../../../stores/currentUserStore'
import userTeamMemberService from './useTeamMemberService'

const dailyReportRepo = new DailyReportRepository()

const useDailyReportService = () => {
  const { uid } = useCurrentUserStore()
  const { updateTodayStudyTime: updateTodayStudyTimeAtMember } =
    userTeamMemberService()
  const today = toISODate(getLocalDate())

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

    const todayStudyTime = todayReport
      ? todayReport.studyTime + studyTime
      : studyTime

    if (!todayReport) {
      await dailyReportRepo.create({ date: today, studyTime: todayStudyTime }, [
        uid,
      ])
    } else {
      await dailyReportRepo.update(
        { studyTime: todayStudyTime },
        todayReport.docId,
        [uid]
      )
    }
    if (todayStudyTime) {
      await updateTodayStudyTimeAtMember(todayStudyTime)
    }
  }

  return {
    handleAddStudyTime,
    getTodayReport,
  }
}

export default useDailyReportService
