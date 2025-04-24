import { useMemo } from 'react'
import {
  handleFinishSession,
  handleRestartSession,
  handleStartSession,
  handleStopSession,
  handleSwitchSession,
} from '../../functions/services/session-service'
import { useCurrentUserStore } from '../../stores/user/currentUserStore'
import { useJoinedTeamsStore } from '../../stores/user/joinedTeamsStore'
import { useStatsMainStore } from '../../stores/user/statsMainStore'
import { progressStatsMainUpdate } from '../../functions/services/user-stats-main-service'

const useSessionService = () => {
  const { uid, user } = useCurrentUserStore()
  const { stats } = useStatsMainStore()
  const { joinedTeams } = useJoinedTeamsStore()
  const { setLastSessionStats } = useStatsMainStore()

  const teamIds = useMemo(
    () => (joinedTeams ? joinedTeams.map((team) => team.docId) : []),
    [joinedTeams]
  )

  const onStartSession = (type: 'study' | 'break', durationMs: number) => {
    if (!uid || !user) return
    handleStartSession(uid, teamIds, user.session, type, durationMs)
  }

  const onStopSession = () => {
    if (!uid || !user) return
    handleStopSession(uid, teamIds, user.session)
  }

  const onRestartSession = () => {
    if (!uid || !user) return
    handleRestartSession(uid, teamIds, user.session)
  }

  const onFinishSession = async () => {
    if (!uid || !user || !stats) return
    const elapsedTime = await handleFinishSession(uid, teamIds, user.session)
    console.log(elapsedTime)

    if (typeof elapsedTime === 'number') {
      const result = await progressStatsMainUpdate(uid, stats, elapsedTime)
      console.log(result)

      setLastSessionStats(result)
    }
  }

  const onSwitchSession = async (
    type: 'study' | 'break',
    durationMs: number
  ) => {
    if (!uid || !user || !stats) return
    const elapsedTime = await handleSwitchSession(
      uid,
      teamIds,
      user.session,
      type,
      durationMs
    )
    if (typeof elapsedTime === 'number') {
      const result = await progressStatsMainUpdate(uid, stats, elapsedTime)
      setLastSessionStats(result)
    }
  }

  return {
    onStartSession,
    onStopSession,
    onRestartSession,
    onFinishSession,
    onSwitchSession,
  }
}

export default useSessionService
