import React from 'react'
import { ListItem, ListItemText, Typography, Box, Stack } from '@mui/material'
import { formatAbbreviatedDuration } from '../../../functions/dateTime-utils/time-format-utils'
import { TeamMemberRead } from '../../../types/firebase/firestore-documents/teams/team-member-document'
import MedalAvatar from './MedalAvatar'

interface RankingItemProps {
  member: TeamMemberRead
  index: number
  isSelf: boolean
}

const RankingItem: React.FC<RankingItemProps> = ({ member, index, isSelf }) => {
  const isTop3 = index < 3

  return (
    <ListItem
      sx={{
        mb: 1.5,
        borderRadius: 2,
        backgroundColor: isSelf ? '#E3F2FD' : 'white',
        boxShadow: isTop3 ? 2 : 0,
      }}
      secondaryAction={
        <Typography
          variant="body2"
          fontWeight="medium"
          color="text.secondary"
          sx={{ minWidth: 80, textAlign: 'right' }}
        >
          {formatAbbreviatedDuration(member.todayStudyTime)}
        </Typography>
      }
    >
      <Box display="flex" alignItems="center" gap={1} width="100%">
        <MedalAvatar rank={index} />
        <ListItemText
          primary={
            <Stack direction="row" spacing={2}>
              <Typography
                variant="body1"
                fontWeight={isSelf ? 'bold' : 'normal'}
              >
                {`${index + 1}位`}
              </Typography>
              {(isSelf || isTop3) && (
                <Typography>{member.displayName}</Typography>
              )}
            </Stack>
          }
        />
      </Box>
    </ListItem>
  )
}

export default RankingItem
