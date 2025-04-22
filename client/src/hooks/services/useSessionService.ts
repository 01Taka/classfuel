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

const useSessionService = () => {
  const { uid, user } = useCurrentUserStore()
  const { stats } = useStatsMainStore()
  const { joinedTeams } = useJoinedTeamsStore()
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
  const onFinishSession = () => {
    if (!uid || !user || !stats) return
    handleFinishSession(uid, teamIds, stats, user.session)
  }
  const onSwitchSession = (type: 'study' | 'break', durationMs: number) => {
    if (!uid || !user || !stats) return
    handleSwitchSession(uid, teamIds, stats, user.session, type, durationMs)
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
