import React from 'react'
import { Box, Stack, Typography } from '@mui/material'

import TimerDisplay from '../../../../components/atoms/TimerDisplay'
import BreakSelector from './BreakSelector'
import TimerController from './TimerController'

interface StudyTimerProps {
  remainingTime: number
  elapsedTime: number
  isRunning: boolean
  breakTimeChoices: number[]
  onStop: () => void
  onRestart: () => void
  onFinish: () => void
  onBreak: (duration: number) => void
}

const StudyTimer: React.FC<StudyTimerProps> = ({
  remainingTime,
  elapsedTime,
  isRunning,
  breakTimeChoices,
  onStop: handleStopSession,
  onRestart: handleRestartSession,
  onFinish: handleFinish,
  onBreak,
}) => {
  return (
    <Stack spacing={2} alignItems="center">
      {remainingTime < 0 && <Typography>経過時間</Typography>}
      <TimerDisplay timeMs={remainingTime >= 0 ? remainingTime : elapsedTime} />
      <Box py={5} />
      {remainingTime >= 0 ? (
        <TimerController
          onFinish={handleFinish}
          onPause={handleStopSession}
          onResume={handleRestartSession}
          isRunning={isRunning}
        />
      ) : (
        <BreakSelector
          breakTimeChoices={breakTimeChoices}
          onBreak={(duration) => onBreak(duration)}
        />
      )}
    </Stack>
  )
}

export default StudyTimer
