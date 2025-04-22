import { useEffect } from 'react'
import { UserStatsMainRepository } from '../../firebase/firestore/repositories/user-stats/user-stats-main-repository'
import { useCurrentUserStore } from '../../stores/user/currentUserStore'
import { useStatsMainStore } from '../../stores/user/statsMainStore'

const statsMainRepo = new UserStatsMainRepository()

const useInitStats = () => {
  const { uid } = useCurrentUserStore()
  const { setStats } = useStatsMainStore()

  const fetchStats = async (uid: string) => {
    const stats = await statsMainRepo.read([uid])
    setStats(stats)
  }

  useEffect(() => {
    if (!uid) return

    fetchStats(uid)

    statsMainRepo.addCallback(
      (data) => {
        setStats(data)
      },
      [uid]
    )
  }, [uid])
}

export default useInitStats
