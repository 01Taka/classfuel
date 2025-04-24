import React from 'react'
import { Stack, Typography } from '@mui/material'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import TimerIcon from '@mui/icons-material/Timer'

interface ExpGainedInfoProps {
  expShort: number
  expLong: number
}

const ExpGainedInfo: React.FC<ExpGainedInfoProps> = ({ expShort, expLong }) => {
  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1}>
        <FlashOnIcon sx={{ width: 40, height: 40 }} color="primary" />
        <Typography variant="h6">短時間経験値: +{expShort}</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <TimerIcon sx={{ width: 40, height: 40 }} color="secondary" />
        <Typography variant="h6">長時間経験値: +{expLong}</Typography>
      </Stack>
    </>
  )
}

export default ExpGainedInfo
