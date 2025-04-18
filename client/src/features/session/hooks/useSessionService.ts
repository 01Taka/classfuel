import { UserRepository } from '../../../firebase/firestore/repositories/users/user-repository'
import { UserSession } from '../../../types/firebase/firestore-documents/users/user-document'
import {
  convertToMilliseconds,
  toTimestamp,
} from '../../../functions/dateTime-utils/time-conversion'
import useDailyReportService from './useDailyReportService'
import { useCurrentUserStore } from '../../../stores/currentUserStore'
import userTeamMemberService from './useTeamMemberService'

const userRepo = new UserRepository()

const useSessionService = () => {
  const { uid, user } = useCurrentUserStore()
  const { handleAddStudyTime } = useDailyReportService()
  const { updateSession: updateSessionInMember } = userTeamMemberService()
  const session = user?.session || null

  const updateSession = async (updatedSession: UserSession | null) => {
    if (!uid) return
    await userRepo.update({ session: updatedSession }, uid)
    await updateSessionInMember(updatedSession)
  }

  const now = () => Date.now()
  const nowTimestamp = () => toTimestamp(now())

  // 累積 + 現在進行中の時間を合算
  const getStudyTime = (session: UserSession) => {
    const base = session.elapsedDuration || 0
    if (session.status === 'running') {
      return base + (now() - convertToMilliseconds(session.latestStartedAt))
    }
    return base
  }

  const createNewSession = (
    type: 'study' | 'break',
    durationMs: number
  ): UserSession => {
    const timestamp = nowTimestamp()

    return {
      type,
      startedAt: timestamp,
      latestStartedAt: timestamp,
      expectedEndAt: toTimestamp(now() + durationMs),
      stoppedAt: null,
      expectedDuration: durationMs,
      status: 'running',
      elapsedDuration: 0,
    }
  }

  const handleStartSession = async (
    type: 'study' | 'break',
    durationMs: number
  ) => {
    if (!uid || session) return
    const newSession = createNewSession(type, durationMs)
    await updateSession(newSession)
  }

  const handleStopSession = async () => {
    if (!session || session.status !== 'running') return

    const elapsed = now() - convertToMilliseconds(session.latestStartedAt)
    const totalElapsed = (session.elapsedDuration || 0) + elapsed

    // 勉強中のみ加算
    if (session.type === 'study') {
      await handleAddStudyTime(totalElapsed)
    }

    const updatedSession: UserSession = {
      ...session,
      stoppedAt: nowTimestamp(),
      status: 'stopped',
      elapsedDuration: totalElapsed,
    }

    await updateSession(updatedSession)
  }

  const handleRestartSession = async () => {
    if (!session?.stoppedAt) return

    const nowMs = now()
    const stoppedDuration = nowMs - convertToMilliseconds(session.stoppedAt)
    const extendedEndAt =
      convertToMilliseconds(session.expectedEndAt) + stoppedDuration

    const updatedSession: UserSession = {
      ...session,
      latestStartedAt: toTimestamp(nowMs),
      expectedEndAt: toTimestamp(extendedEndAt),
      stoppedAt: null,
      status: 'running',
    }

    await updateSession(updatedSession)
  }

  const handleFinishSession = async () => {
    if (!session) return

    if (session.type === 'study') {
      const totalTime = getStudyTime(session)
      await handleAddStudyTime(totalTime)
    }

    await updateSession(null)
  }

  const handleSwitchSession = async (
    type: 'study' | 'break',
    durationMs: number
  ) => {
    if (!uid) return

    if (session && session.type === 'study') {
      const totalTime = getStudyTime(session)
      await handleAddStudyTime(totalTime)
    }

    const newSession = createNewSession(type, durationMs)
    await updateSession(newSession)
  }

  return {
    handleStartSession,
    handleStopSession,
    handleRestartSession,
    handleFinishSession,
    handleSwitchSession,
  }
}

export default useSessionService
