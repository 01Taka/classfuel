import { create } from 'zustand'
import { UserStatsMainRead } from '../../types/firebase/firestore-documents/user-stats/user-stats-main-document'

interface StatsMainStore {
  stats: UserStatsMainRead | null
  setStats: (stats: UserStatsMainRead | null) => void
}

export const useStatsMainStore = create<StatsMainStore>((set) => ({
  stats: null,
  setStats: (stats) => set({ stats }),
}))
