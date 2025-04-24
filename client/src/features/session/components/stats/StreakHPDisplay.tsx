import React from 'react'
import { Stack, Typography } from '@mui/material'
import { Favorite, HeartBroken } from '@mui/icons-material'
import { MAX_STREAK_HP } from '../../../../constants/stats-constants'

interface StreakHPDisplayProps {
  hp: number
  daysToRecover: number
}

const StreakHPDisplay: React.FC<StreakHPDisplayProps> = ({
  hp,
  daysToRecover,
}) => {
  return (
    <Stack alignItems="center" alignSelf="end">
      <Stack direction="row">
        {Array.from({ length: hp }).map((_, i) => (
          <Favorite key={`hp-${i}`} color="error" />
        ))}
        {Array.from({ length: MAX_STREAK_HP - hp }).map((_, i) => (
          <HeartBroken key={`lost-${i}`} color="disabled" />
        ))}
      </Stack>
      {hp !== MAX_STREAK_HP && (
        <Typography variant="caption" color="textSecondary">
          {daysToRecover}日で回復
        </Typography>
      )}
    </Stack>
  )
}

export default StreakHPDisplay
