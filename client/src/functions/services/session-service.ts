import { db } from '../../firebase/firebase'
import BatchManager from '../../firebase/firestore/handler/batch-manager'
import { TeamMemberRepository } from '../../firebase/firestore/repositories/teams/team-member-repository'
import { DailyReportRepository } from '../../firebase/firestore/repositories/users/user-daily-report-repository'
import { UserRepository } from '../../firebase/firestore/repositories/users/user-repository'
import { UserSession } from '../../types/firebase/firestore-documents/users/user-document'
import {
  toTimestamp,
  convertToMilliseconds,
  toISODate,
  getLocalDate,
} from '../dateTime-utils/time-conversion'

// インスタンスはモジュールスコープで保持
const userRepo = new UserRepository()
const teamMemberRepo = new TeamMemberRepository()
const dailyReportRepo = new DailyReportRepository()

const now = () => Date.now()
const nowTimestamp = () => toTimestamp(now())
const today = toISODate(getLocalDate())

// --------------------------------------------
// Session Utilities
// --------------------------------------------

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

const calculateElapsedTime = (session: UserSession): number => {
  const base = session.elapsedDuration || 0
  return session.status === 'running'
    ? base + (now() - convertToMilliseconds(session.latestStartedAt))
    : base
}

const updateSession = async (
  uid: string,
  teamIds: string[] | null,
  updatedSession: UserSession | null
) => {
  const batchManager = new BatchManager(db)
  batchManager.runInBatch(() => {
    userRepo.updateInBatch({ session: updatedSession }, [uid])
    teamIds?.forEach((teamId) => {
      teamMemberRepo.updateInBatch({ session: updatedSession }, [teamId, uid])
    })
  }, [userRepo, teamMemberRepo])
}

// --------------------------------------------
// Daily Report Utilities
// --------------------------------------------

const getTodayReport = async (uid: string) => {
  try {
    return await dailyReportRepo.getFirstMatch('date', today, [uid])
  } catch (error) {
    console.error('Error getting today report:', error)
    return null
  }
}

const updateTeamStudyTime = async (
  uid: string,
  teamIds: string[],
  todayStudyTime: number
) => {
  const batchManager = new BatchManager(db)
  await batchManager.runInBatch(() => {
    teamIds.forEach((teamId) =>
      teamMemberRepo.update({ todayStudyTime }, [teamId, uid])
    )
  }, [teamMemberRepo])
}

const addStudyTime = async (
  uid: string,
  teamIds: string[],
  additionalTime: number
) => {
  const report = await getTodayReport(uid)
  const newStudyTime = (report?.studyTime || 0) + additionalTime

  if (!report) {
    await dailyReportRepo.create({ date: today, studyTime: newStudyTime }, [
      uid,
    ])
  } else {
    await dailyReportRepo.update({ studyTime: newStudyTime }, [
      uid,
      report.docId,
    ])
  }

  await updateTeamStudyTime(uid, teamIds, newStudyTime)
}

// --------------------------------------------
// Session Handlers
// --------------------------------------------

export const handleStartSession = async (
  uid: string,
  teamIds: string[],
  currentSession: UserSession | null,
  type: 'study' | 'break',
  durationMs: number
) => {
  if (!uid || currentSession) return
  const newSession = createNewSession(type, durationMs)
  await updateSession(uid, teamIds, newSession)
}

export const handleStopSession = async (
  uid: string,
  teamIds: string[],
  session: UserSession | null
) => {
  if (!session || session.status !== 'running') return

  const elapsed = calculateElapsedTime(session)
  if (session.type === 'study') {
    await addStudyTime(uid, teamIds, elapsed)
  }

  const updatedSession: UserSession = {
    ...session,
    stoppedAt: nowTimestamp(),
    status: 'stopped',
    elapsedDuration: elapsed,
  }

  await updateSession(uid, teamIds, updatedSession)
}

export const handleRestartSession = async (
  uid: string,
  teamIds: string[],
  session: UserSession | null
) => {
  if (!session?.stoppedAt) return

  const nowMs = now()
  const stoppedDuration = nowMs - convertToMilliseconds(session.stoppedAt)
  const updatedSession: UserSession = {
    ...session,
    latestStartedAt: toTimestamp(nowMs),
    expectedEndAt: toTimestamp(
      convertToMilliseconds(session.expectedEndAt) + stoppedDuration
    ),
    stoppedAt: null,
    status: 'running',
  }

  await updateSession(uid, teamIds, updatedSession)
}

export const handleFinishSession = async (
  uid: string,
  teamIds: string[],
  session: UserSession | null
) => {
  if (!session) return

  let elapsedTime: number | null = null
  if (session.type === 'study') {
    elapsedTime = calculateElapsedTime(session)
    await addStudyTime(uid, teamIds, elapsedTime)
  }

  await updateSession(uid, teamIds, null)
  return elapsedTime
}

export const handleSwitchSession = async (
  uid: string,
  teamIds: string[],
  session: UserSession | null,
  type: 'study' | 'break',
  durationMs: number
): Promise<number | null> => {
  if (!uid) return null

  let elapsedTime: number | null = null
  if (session?.type === 'study') {
    elapsedTime = calculateElapsedTime(session)
    await addStudyTime(uid, teamIds, elapsedTime)
  }

  const newSession = createNewSession(type, durationMs)
  await updateSession(uid, teamIds, newSession)
  return elapsedTime
}
