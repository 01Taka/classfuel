import React, { useEffect } from 'react'
import TimerDisplay from '../atoms/TimerDisplay'
import Btn from '../atoms/Btn'
import { Stack } from '@mui/material'

interface StudyTimerProps {}

const StudyTimer: React.FC<StudyTimerProps> = () => {
  const endTimestamp = Date.now() + 25 * 60 * 1000 // 25分後のタイムスタンプを計算
  const [remainingTime, setRemainingTime] = React.useState(
    endTimestamp - Date.now()
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now()
      const newRemainingTime = endTimestamp - currentTime
      setRemainingTime(newRemainingTime)
    })
    return () => clearInterval(interval)
  }, []) // 1秒ごとに更新

  return (
    <Stack spacing={2} alignItems="center">
      <TimerDisplay timeMs={remainingTime} />
      <Btn fullWidth>終了</Btn>
      <Btn fullWidth>一時停止</Btn>
    </Stack>
  )
}

export default StudyTimer
