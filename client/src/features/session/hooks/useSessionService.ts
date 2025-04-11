import { useMemo } from 'react'
import useCurrentUser from '../../../hooks/useCurrentUser'
import { UserRepository } from '../../../firebase/firestore/repositories/users/user-repository'
import { UserSession } from '../../../types/firebase/firestore-documents/users/user-document'
import {
  convertToMilliseconds,
  toTimestamp,
} from '../../../functions/dateTime-utils/time-conversion'
import useDailyReportService from './useDailyReportService'

const useSessionService = () => {
  const { uid, user } = useCurrentUser()
  const { handleAddStudyTime } = useDailyReportService()
  const session = user?.session || null
  const userRepo = useMemo(() => new UserRepository(), [])

  const updateSession = async (updatedSession: UserSession | null) => {
    if (uid) {
      userRepo.update({ session: updatedSession }, uid)
    }
  }

  const getNowTimestamp = () => toTimestamp(Date.now())

  const handleStartSession = async (
    type: 'study' | 'break',
    durationMs: number
  ) => {
    if (!uid || session) return

    const now = Date.now()
    const newSession: UserSession = {
      type,
      startedAt: toTimestamp(now),
      latestStartedAt: toTimestamp(now),
      expectedEndAt: toTimestamp(now + durationMs),
      stoppedAt: null,
      status: 'running',
    }

    updateSession(newSession)
  }

  const handleStopSession = async () => {
    if (!session) return

    const updatedSession: UserSession = {
      ...session,
      stoppedAt: getNowTimestamp(),
      status: 'stopped',
    }

    updateSession(updatedSession)
  }

  const handleRestartSession = async () => {
    if (!session?.stoppedAt) return

    const now = Date.now()
    const stoppedTime = now - convertToMilliseconds(session.stoppedAt)
    const newExpectedEndAt =
      convertToMilliseconds(session.expectedEndAt) + stoppedTime

    handleAddStudyTime(now - convertToMilliseconds(session.latestStartedAt))

    const updatedSession: UserSession = {
      ...session,
      latestStartedAt: toTimestamp(now),
      expectedEndAt: toTimestamp(newExpectedEndAt),
      stoppedAt: null,
      status: 'running',
    }

    updateSession(updatedSession)
  }

  const handleFinishSession = async () => {
    if (!session) return

    handleAddStudyTime(
      Date.now() - convertToMilliseconds(session.latestStartedAt)
    )
    updateSession(null)
  }

  return {
    handleStartSession,
    handleStopSession,
    handleRestartSession,
    handleFinishSession,
  }
}

export default useSessionService
