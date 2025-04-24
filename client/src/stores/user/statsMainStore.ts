import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserStatsMainRead } from '../../types/firebase/firestore-documents/user-stats/user-stats-main-document'
import { StatsUpdateDetails } from '../../types/services/stats-types'

interface StatsMainStore {
  stats: UserStatsMainRead | null
  lastSessionStats: StatsUpdateDetails | null
  setStats: (stats: UserStatsMainRead | null) => void
  setLastSessionStats: (stats: StatsUpdateDetails | null) => void
}

export const useStatsMainStore = create<StatsMainStore>()(
  persist(
    (set) => ({
      stats: null,
      lastSessionStats: null,
      setStats: (stats) => set({ stats }),
      setLastSessionStats: (stats) => set({ lastSessionStats: stats }),
    }),
    {
      name: 'stats-main-store',
      partialize: (state) => ({
        lastSessionStats: state.lastSessionStats,
      }),
    }
  )
)
