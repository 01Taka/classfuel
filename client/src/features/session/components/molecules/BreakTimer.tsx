import React from 'react'
import { Stack, Typography } from '@mui/material'
import TimerDisplay from '../../../../components/atoms/TimerDisplay'
import NextStudySelector from './NextStudySelector'

interface BreakTimerProps {
  remainingTime: number
  nextStudyTime: number
  nextStudyTimeChoices: number[]
  setNextStudyTime: (time: number) => void
}

const BreakTimer: React.FC<BreakTimerProps> = ({
  remainingTime,
  nextStudyTime,
  nextStudyTimeChoices,
  setNextStudyTime,
}) => {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={3}>
      <Typography variant="h6">休憩中</Typography>
      <TimerDisplay timeMs={remainingTime} />
      <NextStudySelector
        value={nextStudyTime}
        options={nextStudyTimeChoices}
        onChange={setNextStudyTime}
      />
    </Stack>
  )
}

export default BreakTimer
