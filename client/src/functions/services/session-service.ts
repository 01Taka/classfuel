// import { db } from '../../firebase/firebase'
// import BatchManager from '../../firebase/firestore/handler/batch-manager'
// import { TeamMemberRepository } from '../../firebase/firestore/repositories/teams/team-member-repository'
// import { UserRepository } from '../../firebase/firestore/repositories/users/user-repository'
// import { UserSession } from '../../types/firebase/firestore-documents/users/user-document'
// import {
//   toTimestamp,
//   convertToMilliseconds,
// } from '../dateTime-utils/time-conversion'

// // このモジュール内でインスタンス保持
// const userRepo = new UserRepository()
// const teamMemberRepo = new TeamMemberRepository()

// const now = () => Date.now()
// const nowTimestamp = () => toTimestamp(now())

// // -----------------------------
// // セッションユーティリティ群
// // -----------------------------

// export const updateSession = async (
//   uid: string,
//   joinedTeamIds: string[],
//   updatedSession: UserSession | null
// ) => {
//   const batchManager = new BatchManager(db)
//   batchManager.runInBatch(() => {
//     userRepo.updateInBatch({ session: updatedSession }, uid)
//     joinedTeamIds.map(teamId => {
//       teamMemberRepo.updateInBatch({ session: updatedSession }, uid, [teamId])
//     })
//   }, [userRepo, teamMemberRepo])
// }

// export const getStudyTime = (session: UserSession) => {
//   const base = session.elapsedDuration || 0
//   if (session.status === 'running') {
//     return base + (now() - convertToMilliseconds(session.latestStartedAt))
//   }
//   return base
// }

// export const createNewSession = (
//   type: 'study' | 'break',
//   durationMs: number
// ): UserSession => {
//   const timestamp = nowTimestamp()

//   return {
//     type,
//     startedAt: timestamp,
//     latestStartedAt: timestamp,
//     expectedEndAt: toTimestamp(now() + durationMs),
//     stoppedAt: null,
//     expectedDuration: durationMs,
//     status: 'running',
//     elapsedDuration: 0,
//   }
// }

// const handleAddStudyTime = async (uid: string, studyTime: number) => {
//   if (!uid) return
//   const todayReport = await getTodayReport()

//   const todayStudyTime = todayReport
//     ? todayReport.studyTime + studyTime
//     : studyTime

//   if (!todayReport) {
//     await dailyReportRepo.create({ date: today, studyTime: todayStudyTime }, [
//       uid,
//     ])
//   } else {
//     await dailyReportRepo.update(
//       { studyTime: todayStudyTime },
//       todayReport.docId,
//       [uid]
//     )
//   }
//   if (todayStudyTime) {
//     await updateTodayStudyTimeAtMember(todayStudyTime)
//   }
// }

// // -----------------------------
// // 操作インターフェース
// // -----------------------------

// export const handleStartSession = async (
//   uid: string,
//   joinedTeamIds: string[],
//   session: UserSession | null,
//   type: 'study' | 'break',
//   durationMs: number
// ) => {
//   if (!uid || session) return
//   const newSession = createNewSession(type, durationMs)
//   await updateSession(uid, joinedTeamIds, newSession)
// }

// export const handleStopSession = async (
//   uid: string,
//   joinedTeamIds: string[],
//   session: UserSession | null
// ) => {
//   if (!session || session.status !== 'running') return

//   const elapsed = now() - convertToMilliseconds(session.latestStartedAt)
//   const totalElapsed = (session.elapsedDuration || 0) + elapsed

//   if (session.type === 'study') {
//     await handleAddStudyTime(totalElapsed)
//   }

//   const updatedSession: UserSession = {
//     ...session,
//     stoppedAt: nowTimestamp(),
//     status: 'stopped',
//     elapsedDuration: totalElapsed,
//   }

//   await updateSession(uid, updatedSession)
// }

// export const handleRestartSession = async (
//   uid: string,
//   session: UserSession | null
// ) => {
//   if (!session?.stoppedAt) return

//   const nowMs = now()
//   const stoppedDuration = nowMs - convertToMilliseconds(session.stoppedAt)
//   const extendedEndAt =
//     convertToMilliseconds(session.expectedEndAt) + stoppedDuration

//   const updatedSession: UserSession = {
//     ...session,
//     latestStartedAt: toTimestamp(nowMs),
//     expectedEndAt: toTimestamp(extendedEndAt),
//     stoppedAt: null,
//     status: 'running',
//   }

//   await updateSession(uid, updatedSession)
// }

// export const handleFinishSession = async (
//   uid: string,
//   session: UserSession | null
// ) => {
//   if (!session) return

//   if (session.type === 'study') {
//     const totalTime = getStudyTime(session)
//     await handleAddStudyTime(totalTime)
//   }

//   await updateSession(uid, null)
// }

// export const handleSwitchSession = async (
//   uid: string,
//   session: UserSession | null,
//   type: 'study' | 'break',
//   durationMs: number
// ) => {
//   if (!uid) return

//   if (session?.type === 'study') {
//     const totalTime = getStudyTime(session)
//     await handleAddStudyTime(totalTime)
//   }

//   const newSession = createNewSession(type, durationMs)
//   await updateSession(uid, newSession)
// }
