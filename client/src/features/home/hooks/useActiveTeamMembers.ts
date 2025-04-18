import { useEffect, useState } from 'react'
import { TeamMemberRepository } from '../../../firebase/firestore/repositories/teams/team-member-repository'
import { TeamMemberRead } from '../../../types/firebase/firestore-documents/teams/team-member-document'
import { useCurrentUserStore } from '../../../stores/currentUserStore'

const teamMemberRepo = new TeamMemberRepository()

const useActiveTeamMembers = () => {
  const { user } = useCurrentUserStore()
  const [members, setMembers] = useState<TeamMemberRead[]>([])

  useEffect(() => {
    const teamId = user?.activeTeamId
    if (teamId) {
      teamMemberRepo.addReadCollectionCallback(
        (members) => {
          setMembers(members)
        },
        [teamId]
      )
    }
  }, [user?.activeTeamId])

  return { members }
}

export default useActiveTeamMembers
