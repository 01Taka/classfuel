import { increment } from 'firebase/firestore'
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

// Repositories (module scope)
const userRepo = new UserRepository()
const teamMemberRepo = new TeamMemberRepository()
const dailyReportRepo = new DailyReportRepository()

const now = () => Date.now()
const nowTimestamp = () => toTimestamp(now())
const today = toISODate(getLocalDate())

// --------------------------------------------
// Low-level utilities
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

// --------------------------------------------
// Data operations
// --------------------------------------------

const updateSession = async (
  uid: string,
  teamIds: string[] | null,
  updatedSession: UserSession | null
) => {
  const batchManager = new BatchManager(db)
  await batchManager.runInBatch(() => {
    userRepo.updateInBatch({ session: updatedSession }, [uid])
    teamIds?.forEach((teamId) => {
      teamMemberRepo.updateInBatch({ session: updatedSession }, [teamId, uid])
    })
  }, [userRepo, teamMemberRepo])
}

const getTodayReport = async (uid: string) => {
  try {
    return await dailyReportRepo.getFirstMatch('date', today, [uid])
  } catch (error) {
    console.error('Error getting today report:', error)
    return null
  }
}

const addStudyTimeToTodayReport = async (
  uid: string,
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

  return newStudyTime
}

const addStudyTime = async (
  uid: string,
  teamIds: string[] | null,
  additionalTime: number
) => {
  const newStudyTime = await addStudyTimeToTodayReport(uid, additionalTime)

  if (teamIds) {
    const batchManager = new BatchManager(db)
    await batchManager.runInBatch(() => {
      userRepo.updateInBatch(
        { status: { totalStudyDuration: increment(additionalTime) } },
        [uid]
      )

      teamIds.forEach((teamId) =>
        teamMemberRepo.updateInBatch({ todayStudyTime: newStudyTime }, [
          teamId,
          uid,
        ])
      )
    }, [userRepo, teamMemberRepo])
  }
}

// --------------------------------------------
// Unified session update handler
// --------------------------------------------

type ApplySessionOptions = {
  uid: string
  teamIds: string[] | null
  sessionBefore: UserSession | null
  sessionAfter: UserSession | null
  updateStudyTime?: boolean // デフォルト true
}

/**
 * Apply session changes and optionally update study time if sessionBefore was 'study'.
 * @returns elapsed study time in ms if updated, otherwise null.
 */
export const applySessionUpdate = async ({
  uid,
  teamIds,
  sessionBefore,
  sessionAfter,
  updateStudyTime = true,
}: ApplySessionOptions): Promise<number | null> => {
  let elapsed: number | null = null

  // 前のセッションが study であれば経過時間を追加
  if (sessionBefore?.type === 'study' && updateStudyTime) {
    elapsed = calculateElapsedTime(sessionBefore)
    await addStudyTime(uid, teamIds, elapsed)
  }

  // ユーザーとチームへの session 更新
  await updateSession(uid, teamIds, sessionAfter)
  return elapsed
}

// --------------------------------------------
// Session Handlers (Refactored)
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
  await applySessionUpdate({
    uid,
    teamIds,
    sessionBefore: null,
    sessionAfter: newSession,
    updateStudyTime: false,
  })
}

export const handleStopSession = async (
  uid: string,
  teamIds: string[],
  session: UserSession | null
) => {
  if (!session || session.status !== 'running') return

  const updatedSession: UserSession = {
    ...session,
    stoppedAt: nowTimestamp(),
    status: 'stopped',
    elapsedDuration: calculateElapsedTime(session),
  }

  await applySessionUpdate({
    uid,
    teamIds,
    sessionBefore: session,
    sessionAfter: updatedSession,
  })
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

  await applySessionUpdate({
    uid,
    teamIds,
    sessionBefore: session,
    sessionAfter: updatedSession,
    updateStudyTime: false, // 再開時には studyTime を追加しない
  })
}

export const handleFinishSession = async (
  uid: string,
  teamIds: string[],
  session: UserSession | null
): Promise<number | null> => {
  if (!session) return null
  const elapsed = await applySessionUpdate({
    uid,
    teamIds,
    sessionBefore: session,
    sessionAfter: null,
  })
  return elapsed
}

export const handleSwitchSession = async (
  uid: string,
  teamIds: string[],
  session: UserSession | null,
  type: 'study' | 'break',
  durationMs: number
): Promise<number | null> => {
  if (!uid) return null
  const newSession = createNewSession(type, durationMs)
  const elapsed = await applySessionUpdate({
    uid,
    teamIds,
    sessionBefore: session,
    sessionAfter: newSession,
  })
  return elapsed
}
