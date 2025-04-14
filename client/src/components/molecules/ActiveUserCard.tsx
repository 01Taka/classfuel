import React from 'react'
import ContainerCard from '../atoms/ContainerCard'
import { Box, Stack, Typography } from '@mui/material'
import { formatTime } from '../../functions/dateTime-utils/time-format-utils'
import IconWithLabel from '../atoms/AvaterWithLabel'

interface ActiveUserCardProps {
  iconUrl: string
  userName: string
  stateLabel: string
  timerMs: number
  subjectLabel: string
  subjectColor: string
}

const ActiveUserCard: React.FC<ActiveUserCardProps> = ({
  iconUrl,
  userName,
  stateLabel,
  timerMs,
  subjectLabel,
  subjectColor,
}) => {
  return (
    <ContainerCard>
      <IconWithLabel src={iconUrl} label={userName} />
      <Stack spacing={0.5} flexGrow={1}>
        <Typography variant="body2" color="text.secondary">
          {stateLabel}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatTime(timerMs)}
        </Typography>
      </Stack>
      <Box
        sx={{
          minWidth: 60,
          px: 1,
          py: 0.5,
          borderRadius: 1,
          fontSize: 12,
          fontWeight: 500,
          color: 'white',
          backgroundColor: subjectColor,
          textAlign: 'center',
        }}
      >
        {subjectLabel}
      </Box>
    </ContainerCard>
  )
}

export default ActiveUserCard
