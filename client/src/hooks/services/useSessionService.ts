import { useMemo } from 'react'
import {
  handleFinishSession,
  handleRestartSession,
  handleStartSession,
  handleStopSession,
  handleSwitchSession,
} from '../../functions/services/session-service'
import { useCurrentUserStore } from '../../stores/currentUserStore'
import { useJoinedTeamsStore } from '../../stores/joinedTeamsStore'

const useSessionService = () => {
  const { uid, user } = useCurrentUserStore()
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
    if (!uid || !user) return
    handleFinishSession(uid, teamIds, user.session)
  }
  const onSwitchSession = (type: 'study' | 'break', durationMs: number) => {
    if (!uid || !user) return
    handleSwitchSession(uid, teamIds, user.session, type, durationMs)
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
