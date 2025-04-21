import { UserRepository } from '../../../firebase/firestore/repositories/users/user-repository'
import { toTimestamp } from '../../../functions/dateTime-utils/time-conversion'
import { handleJoinTeam } from '../../join-team/services/team-services'
import { UserWrite } from '../../../types/firebase/firestore-documents/users/user-document'
import { UserSetUpFormState } from '../hooks/useUserSetupForm'

const userRepo = new UserRepository()

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
