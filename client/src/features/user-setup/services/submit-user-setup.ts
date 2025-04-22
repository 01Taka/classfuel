import { UserRepository } from '../../../firebase/firestore/repositories/users/user-repository'
import { toTimestamp } from '../../../functions/dateTime-utils/time-conversion'
import { handleJoinTeam } from '../../join-team/services/team-services'
import { UserWrite } from '../../../types/firebase/firestore-documents/users/user-document'
import { UserSetUpFormState } from '../hooks/useUserSetupForm'
import { UserStatsMainRepository } from '../../../firebase/firestore/repositories/user-stats/user-stats-main-repository'
import { UserStatsMainWrite } from '../../../types/firebase/firestore-documents/user-stats/user-stats-main-document'
import { serverTimestamp } from 'firebase/firestore'

const userRepo = new UserRepository()
const userStatsMainRepo = new UserStatsMainRepository()

export const submitUserSetup = async (
  uid: string,
  formState: UserSetUpFormState,
  teamCode: string | null
) => {
  if (!formState.birthdate || !formState.gender) {
    return
  }
  const userInfo: UserWrite = {
    displayName: formState.displayName,
    birthdate: toTimestamp(formState.birthdate),
    gender: formState.gender,
    session: null,
    activeTeamId: null,
  }

  await userRepo.createWithId(userInfo, [uid])
  await handleCreateStats(uid)

  if (teamCode) {
    await handleJoinTeam(
      {
        docId: uid,
        displayName: formState.displayName,
        todayStudyTime: 0,
        session: null,
      },
      teamCode,
      true
    )
  }
}

export const handleCreateStats = async (uid: string) => {
  const stats: UserStatsMainWrite = {
    streak: 1,
    streakHP: 2,
    lastStudyTimestamp: null,
    daysStudiedSinceLastHPUse: 0,
    expShort: 0,
    expLong: 0,
  }

  await userStatsMainRepo.create(stats, [uid])
}
