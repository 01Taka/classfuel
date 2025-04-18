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
          setMembers(sortTeamMembers(members))
        },
        [teamId]
      )
    }
  }, [user?.activeTeamId])

  const sortTeamMembers = (members: TeamMemberRead[]): TeamMemberRead[] => {
    return members.slice().sort((a, b) => {
      const aHasSession = a.session !== null
      const bHasSession = b.session !== null

      // 1. セッションの有無
      if (aHasSession !== bHasSession) {
        return aHasSession ? -1 : 1
      }

      // 両方セッションがない場合はそのまま
      if (!a.session || !b.session) {
        return 0
      }

      // 2. 勉強中優先
      const aIsStudying = a.session.type === 'study'
      const bIsStudying = b.session.type === 'study'
      if (aIsStudying !== bIsStudying) {
        return aIsStudying ? -1 : 1
      }

      // 3. 開始時間が新しい順（latestStartedAt の降順）
      const aTime = a.session.latestStartedAt
      const bTime = b.session.latestStartedAt

      // Assuming Timestamp is number-like or Date-like; adapt if needed
      return bTime > aTime ? 1 : bTime < aTime ? -1 : 0
    })
  }

  return { members }
}

export default useActiveTeamMembers
