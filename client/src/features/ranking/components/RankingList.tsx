import React, { useState } from 'react'
import { Card, CardContent, IconButton, Stack, Typography } from '@mui/material'
import OverallRankings from './OverallRankings'
import Popup from '../../../components/molecules/Popup'
import { UnfoldMore } from '@mui/icons-material'
import { TeamMemberRead } from '../../../types/firebase/firestore-documents/teams/team-member-document'
import RankingMemberList from './RankingMemberList'
import { findSelfInMembers } from '../services/find-self'

interface RankingListProps {
  label: string
  members: TeamMemberRead[]
  uid: string
}

const RankingList: React.FC<RankingListProps> = ({ label, members, uid }) => {
  const [open, setOpen] = useState(false)

  const top3 = members ? members.slice(0, 3) : []

  const self = findSelfInMembers(uid, members ?? [])

  return (
    <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" gutterBottom>
            {label}
          </Typography>
          <IconButton onClick={() => setOpen(true)}>
            <UnfoldMore />
          </IconButton>
        </Stack>

        <RankingMemberList members={top3} uid={uid} />

        <Popup open={open} onClose={setOpen}>
          <OverallRankings
            label={label}
            uid={uid}
            members={members}
            self={self}
          />
        </Popup>
      </CardContent>
    </Card>
  )
}

export default RankingList
