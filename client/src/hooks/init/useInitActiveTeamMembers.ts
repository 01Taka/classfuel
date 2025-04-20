import { useCallback, useEffect } from 'react'
import { useCurrentUserStore } from '../../stores/currentUserStore'
import { TeamMemberRepository } from '../../firebase/firestore/repositories/teams/team-member-repository'
import { useActiveTeamMembersStore } from '../../stores/activeTeamMembersStore'

const teamMemberRepo = new TeamMemberRepository()

const useInitActiveTeamMembers = () => {
  const { user } = useCurrentUserStore()
  const { setActiveTeamMembers } = useActiveTeamMembersStore()

  const fetchMembers = useCallback(async (teamId: string) => {
    const teams = await teamMemberRepo.getAll([teamId])
    setActiveTeamMembers(teams)
  }, [])

  useEffect(() => {
    if (!user?.activeTeamId) return

    fetchMembers(user.activeTeamId)

    const { unsubscribe } = teamMemberRepo.addReadCollectionCallback(
      (members) => {
        setActiveTeamMembers(members)
      },
      [user.activeTeamId]
    )
    return () => unsubscribe()
  }, [user?.activeTeamId])
}

export default useInitActiveTeamMembers
