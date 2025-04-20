import React from 'react'
import { Divider, List, Paper, Stack, Typography } from '@mui/material'
import { TeamMemberRead } from '../../../types/firebase/firestore-documents/teams/team-member-document'
import RankingItem from './RankingItem'

interface OverallRankingsProps {
  label: string
  uid: string
  members: TeamMemberRead[]
  self: { member: TeamMemberRead; index: number } | null
}

const OverallRankings: React.FC<OverallRankingsProps> = ({
  label,
  uid,
  members,
  self,
}) => {
  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 4,
        p: 2,
        backgroundColor: '#fafafa',
        width: '100%',
        maxWidth: '80vw',
        mx: 'auto',
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {label}
      </Typography>
      <List disablePadding sx={{ height: '75vh', overflow: 'auto' }}>
        {members.map((member, index) => (
          <RankingItem
            key={member.docId}
            member={member}
            index={index}
            isSelf={uid === member.docId}
          />
        ))}
      </List>
      {self && (
        <Stack pt={2} spacing={2}>
          <Divider />
          <RankingItem isSelf member={self.member} index={self.index} />
        </Stack>
      )}
    </Paper>
  )
}

export default OverallRankings
