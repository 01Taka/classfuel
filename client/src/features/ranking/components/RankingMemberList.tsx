import React from 'react'
import { List } from '@mui/material'
import { TeamMemberRead } from '../../../types/firebase/firestore-documents/teams/team-member-document'
import RankingItem from './RankingItem'

interface RankingMemberListProps {
  uid: string
  members: TeamMemberRead[]
}

const RankingMemberList: React.FC<RankingMemberListProps> = ({
  uid,
  members,
}) => {
  return (
    <List disablePadding>
      {members.map((member, index) => (
        <RankingItem
          key={member.docId}
          member={member}
          index={index}
          isSelf={uid === member.docId}
        />
      ))}
    </List>
  )
}

export default RankingMemberList
