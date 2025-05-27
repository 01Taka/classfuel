import { useEffect } from 'react'
import { useCurrentUserStore } from '../../stores/user/currentUserStore'
import useDailyReportService from '../../features/session/hooks/useDailyReportService'
import { DailyReportRepository } from '../../firebase/firestore/repositories/users/user-daily-report-repository'
import { useUserReportStore } from '../../stores/user/userReportStore'

const dailyReportRepo = new DailyReportRepository()

const useInitReport = () => {
  const { uid } = useCurrentUserStore()
  const { todayReport, setTodayReport } = useUserReportStore()
  const { updateTodayReport } = useDailyReportService()

  useEffect(() => {
    updateTodayReport()
  }, [])

  useEffect(() => {
    if (!uid || !todayReport?.docId) return

    console.log("updating today's report")

    const { unsubscribe } = dailyReportRepo.addReadCallback(
      (newReport) => {
        setTodayReport(newReport)
      },
      [uid, todayReport.docId]
    )
    return () => unsubscribe()
  }, [todayReport?.docId, uid])
}

export default useInitReport
