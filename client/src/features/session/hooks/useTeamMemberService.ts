import { db } from '../../../firebase/firebase'
import BatchManager from '../../../firebase/firestore/handler/batch-manager'
import { TeamMemberRepository } from '../../../firebase/firestore/repositories/teams/team-member-repository'
import { UserJoinedTeamRepository } from '../../../firebase/firestore/repositories/users/user-joined-team-repository'
import { useCurrentUserStore } from '../../../stores/currentUserStore'

const userJoinedTeamRepo = new UserJoinedTeamRepository()
const teamMemberRepo = new TeamMemberRepository()

const userTeamMemberService = () => {
  const { uid } = useCurrentUserStore()
  const updateTodayStudyTime = async (todayStudyTime: number) => {
    if (!uid) return
    // TODO: Functions に移動
    const teams = await userJoinedTeamRepo.getAll([uid])
    const teamIds = teams.map((team) => team.docId)

    const batchManager = new BatchManager(db)
    await batchManager.runInBatch(() => {
      teamIds.forEach((teamId) => {
        teamMemberRepo.update({ todayStudyTime }, uid, [teamId])
      })
    }, [teamMemberRepo])
  }

  return { updateTodayStudyTime }
}

export default userTeamMemberService
