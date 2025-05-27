// stores/useUserStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DailyReportRead } from '../../types/firebase/firestore-documents/users/user-daily-report-document'

interface UserReportStoreStore {
  todayReport: DailyReportRead | null
  setTodayReport: (report: DailyReportRead | null) => void
}

export const useUserReportStore = create(
  persist<UserReportStoreStore>(
    (set) => ({
      todayReport: null,
      setTodayReport: (report: DailyReportRead | null) =>
        set({ todayReport: report }),
    }),
    {
      name: 'user-report-store',
    }
  )
)
