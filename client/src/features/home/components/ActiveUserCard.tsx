import React from 'react'
import ContainerCard from '../../../components/atoms/ContainerCard'
import { Box, Stack, Typography } from '@mui/material'
import IconWithLabel from '../../../components/atoms/AvatarWithLabel'

interface ActiveUserCardProps {
  iconUrl: string
  userName: string
  stateLabel: string
  cardColor: string
  timerText: string
  subjectLabel: string
  subjectColor: string
}

const ActiveUserCard: React.FC<ActiveUserCardProps> = ({
  iconUrl,
  userName,
  stateLabel,
  cardColor,
  timerText,
  subjectLabel,
  subjectColor,
}) => {
  return (
    <ContainerCard sx={{ maxWidth: '30vw', width: 105, bgcolor: cardColor }}>
      <IconWithLabel src={iconUrl} label={userName} />
      <Stack spacing={0.5} flexGrow={1}>
        <Typography variant="body2" color="text.secondary">
          {stateLabel}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {timerText}
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
