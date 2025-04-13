import React from 'react'
import { Stack } from '@mui/material'
import Btn from '../../../../components/atoms/Btn'

interface TimerControllerProps {
  onFinish: () => void
  onPause: () => void
  onResume: () => void
  isRunning: boolean
}

const TimerController: React.FC<TimerControllerProps> = ({
  onFinish,
  onPause,
  onResume,
  isRunning,
}) => {
  return (
    <Stack width={'100%'} spacing={2}>
      <Btn fullWidth onClick={onFinish}>
        終了
      </Btn>
      <Btn fullWidth onClick={isRunning ? onPause : onResume}>
        {isRunning ? '一時停止' : '再開'}
      </Btn>
    </Stack>
  )
}

export default TimerController
