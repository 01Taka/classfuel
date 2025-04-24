import React from 'react'
import { Stack, Typography } from '@mui/material'
import WhatshotIcon from '@mui/icons-material/Whatshot'

interface StreakInfoProps {
  streak: number
}

const StreakInfo: React.FC<StreakInfoProps> = ({ streak }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <WhatshotIcon sx={{ width: 60, height: 60 }} color="warning" />
      <Stack direction="column" alignItems="center">
        <Typography variant="h5">ストリーク</Typography>
        <Typography variant="h4">{streak}日目</Typography>
      </Stack>
    </Stack>
  )
}

export default StreakInfo
