import React from 'react'
import { useActiveTeamMembersStore } from '../../../stores/user/activeTeamMembersStore'
import { useCurrentUserStore } from '../../../stores/user/currentUserStore'
import RankingList from './RankingList'

interface RankingProps {}

const Ranking: React.FC<RankingProps> = ({}) => {
  const { uid } = useCurrentUserStore()
  const { members: storeMembers } = useActiveTeamMembersStore()
  const members = [...storeMembers].sort(
    (a, b) => b.todayStudyTime - a.todayStudyTime
  )

  return (
    <div>
      <RankingList label="今日のランキング" uid={uid ?? ''} members={members} />
    </div>
  )
}

export default Ranking
