import React, { useEffect, useMemo, useState } from 'react'
import TimerDisplay from '../atoms/TimerDisplay'
import Btn from '../atoms/Btn'
import { Box, Stack } from '@mui/material'
import { convertToMilliseconds } from '../../functions/dateTime-utils/time-conversion'
import useSessionService from '../../features/session/hooks/useSessionService'
import { useNavigate } from 'react-router-dom'
import { useCurrentUserStore } from '../../stores/currentUserStore'

const StudyTimer: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useCurrentUserStore()
  const { handleStopSession, handleRestartSession, handleFinishSession } =
    useSessionService()

  const [diffTime, setDiffTime] = useState<number>(0)

  useEffect(() => {
    const endTimestamp = user?.session?.expectedEndAt
    if (!endTimestamp) return

    const endTimeMs = convertToMilliseconds(endTimestamp)

    const updateRemainingTime = () => {
      const now = Date.now()
      setDiffTime(Math.max(endTimeMs - now, 0))
    }

    updateRemainingTime() // 初期更新
    const interval = setInterval(updateRemainingTime, 1000)

    return () => clearInterval(interval)
  }, [user?.session?.expectedEndAt])

  const remainingTime = useMemo(() => {
    if (user?.session?.status === 'running') {
      return diffTime
    } else {
      const stoppedAt = convertToMilliseconds(user?.session?.stoppedAt || 0)
      const expectedEndAt = convertToMilliseconds(
        user?.session?.expectedEndAt || 0
      )
      return expectedEndAt - stoppedAt
    }
  }, [diffTime, user?.session])

  const handleFinish = () => {
    handleFinishSession()
    navigate('/')
  }

  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      height={'100vh'}
    >
      <TimerDisplay timeMs={remainingTime} />
      <Box py={5} />
      <Btn fullWidth onClick={handleFinish}>
        終了
      </Btn>
      <Btn
        fullWidth
        onClick={
          user?.session?.status === 'running'
            ? handleStopSession
            : handleRestartSession
        }
      >
        {user?.session?.status === 'running' ? '一時停止' : '再開'}
      </Btn>
    </Stack>
  )
}

export default StudyTimer
