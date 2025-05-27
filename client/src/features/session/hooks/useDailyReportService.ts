import { DailyReportRepository } from '../../../firebase/firestore/repositories/users/user-daily-report-repository'
import {
  getLocalDate,
  toISODate,
} from '../../../functions/dateTime-utils/time-conversion'
import { useCurrentUserStore } from '../../../stores/user/currentUserStore'
import { useUserReportStore } from '../../../stores/user/userReportStore'
import userTeamMemberService from './useTeamMemberService'

const dailyReportRepo = new DailyReportRepository()

const useDailyReportService = () => {
  const { uid } = useCurrentUserStore()
  const { updateTodayStudyTime: updateTodayStudyTimeAtMember } =
    userTeamMemberService()
  const { setTodayReport } = useUserReportStore()
  const today = toISODate(getLocalDate())

  const updateTodayReport = async () => {
    if (!uid) return null
    try {
      const report = await dailyReportRepo.getFirstMatch('date', today, [uid])
      setTodayReport(report)
      return report
    } catch (error) {
      console.error('Error getting today report:', error)
      return null
    }
  }

  const handleAddStudyTime = async (studyTime: number) => {
    if (!uid) return
    const todayReport = await updateTodayReport()

    const todayStudyTime = todayReport
      ? todayReport.studyTime + studyTime
      : studyTime

    if (!todayReport) {
      await dailyReportRepo.create({ date: today, studyTime: todayStudyTime }, [
        uid,
      ])
    } else {
      await dailyReportRepo.update({ studyTime: todayStudyTime }, [
        uid,
        todayReport.docId,
      ])
    }
    if (todayStudyTime) {
      await updateTodayStudyTimeAtMember(todayStudyTime)
    }
  }

  return {
    handleAddStudyTime,
    updateTodayReport,
  }
}

export default useDailyReportService
