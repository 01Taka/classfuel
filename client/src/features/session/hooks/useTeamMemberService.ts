import { useMemo } from 'react'
import { db } from '../../../firebase/firebase'
import BatchManager from '../../../firebase/firestore/handler/batch-manager'
import { TeamMemberRepository } from '../../../firebase/firestore/repositories/teams/team-member-repository'
import { useCurrentUserStore } from '../../../stores/currentUserStore'
import { useJoinedTeamsStore } from '../../../stores/joinedTeamsStore'
import { UserSession } from '../../../types/firebase/firestore-documents/users/user-document'

const teamMemberRepo = new TeamMemberRepository()

const userTeamMemberService = () => {
  const { uid } = useCurrentUserStore()
  const { joinedTeams } = useJoinedTeamsStore()

  const teamIds = useMemo(
    () => (joinedTeams ? joinedTeams.map((team) => team.docId) : []),
    [joinedTeams]
  )

  const updateTodayStudyTime = async (todayStudyTime: number) => {
    if (!uid) return
    // TODO: Functions に移動

    const batchManager = new BatchManager(db)
    await batchManager.runInBatch(() => {
      teamIds.forEach((teamId) => {
        teamMemberRepo.update({ todayStudyTime }, [teamId, uid])
      })
    }, [teamMemberRepo])
  }

  const updateSession = async (session: UserSession | null) => {
    if (!uid) return
    const batchManager = new BatchManager(db)
    await batchManager.runInBatch(() => {
      teamIds.forEach((teamId) => {
        teamMemberRepo.update({ session }, [teamId, uid])
      })
    }, [teamMemberRepo])
  }

  return { updateTodayStudyTime, updateSession }
}

export default userTeamMemberService
