import { useMemo } from 'react'
import { UserRepository } from '../../../firebase/firestore/repositories/users/user-repository'
import { UserSession } from '../../../types/firebase/firestore-documents/users/user-document'
import {
  convertToMilliseconds,
  toTimestamp,
} from '../../../functions/dateTime-utils/time-conversion'
import useDailyReportService from './useDailyReportService'
import { useCurrentUserStore } from '../../../stores/currentUserStore'

const useSessionService = () => {
  const { uid, user } = useCurrentUserStore()
  const { handleAddStudyTime } = useDailyReportService()
  const session = user?.session || null
  const userRepo = useMemo(() => new UserRepository(), [])

  const updateSession = async (updatedSession: UserSession | null) => {
    if (!uid) return
    await userRepo.update({ session: updatedSession }, uid)
  }

  const now = () => Date.now()
  const nowTimestamp = () => toTimestamp(now())

  const getStudyTime = (session: UserSession) => {
    return now() - convertToMilliseconds(session.latestStartedAt)
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

    // 勉強中のみ加算
    if (session.type === 'study') {
      await handleAddStudyTime(getStudyTime(session))
    }

    const updatedSession: UserSession = {
      ...session,
      stoppedAt: nowTimestamp(),
      status: 'stopped',
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

    // 勉強中でかつ running 状態のときのみ記録
    if (session.type === 'study' && session.status === 'running') {
      await handleAddStudyTime(getStudyTime(session))
    }

    await updateSession(null)
  }

  const handleSwitchSession = async (
    type: 'study' | 'break',
    durationMs: number
  ) => {
    if (!uid) return

    if (session && session.type === 'study' && session.status === 'running') {
      await handleAddStudyTime(getStudyTime(session))
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
