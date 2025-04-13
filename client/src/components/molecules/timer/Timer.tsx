import { Box, Stack } from '@mui/material'
import React from 'react'
import Btn from '../../atoms/Btn'
import TimerDisplay from '../../atoms/TimerDisplay'

interface TimerProps {
  time: number
  isRunning?: boolean
  onFinish?: () => void
  onStop?: () => void
  onRestart?: () => void
}

const Timer: React.FC<TimerProps> = ({
  time,
  isRunning,
  onFinish,
  onStop,
  onRestart,
}) => {
  return (
    <Stack>
      <TimerDisplay timeMs={time} />
      <Box py={5} />
      <Btn fullWidth onClick={onFinish}>
        終了
      </Btn>
      <Btn fullWidth onClick={isRunning ? onStop : onRestart}>
        {isRunning ? '一時停止' : '再開'}
      </Btn>
    </Stack>
  )
}

export default Timer
