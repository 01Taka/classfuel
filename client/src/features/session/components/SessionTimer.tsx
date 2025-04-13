import React, { useEffect, useState } from 'react'
import StudyTimer from './molecules/StudyTimer'
import { useNavigate } from 'react-router-dom'
import { useCurrentUserStore } from '../../../stores/currentUserStore'
import useRemainingTime from '../hooks/useRemainingTime'
import useSessionService from '../hooks/useSessionService'
import BreakTimer from './molecules/BreakTimer'
import {
  breakTimeChoices,
  studyTimeChoices,
} from '../../../constants/session-time-constants'
import Btn from '../../../components/atoms/Btn'

interface SessionTimerProps {}

const SessionTimer: React.FC<SessionTimerProps> = ({}) => {
  const navigate = useNavigate()
  const { user } = useCurrentUserStore()
  const {
    handleStopSession,
    handleRestartSession,
    handleFinishSession,
    handleSwitchSession,
  } = useSessionService()
  const { remainingTime, elapsedTime } = useRemainingTime()

  const [nextStudyTime, setNextStudyTime] = useState<number>(25 * 60 * 1000)

  const [hasBreakStarted, setHasBreakStarted] = useState(false)

  useEffect(() => {
    // breakに切り替わった瞬間だけで1回だけtrueに
    if (user?.session?.type === 'break' && !hasBreakStarted) {
      setHasBreakStarted(true)
    }
  }, [user?.session?.type])

  useEffect(() => {
    // breakが始まってから、残り時間がマイナスになったらstudyに切り替え
    if (hasBreakStarted && remainingTime < 0) {
      handleSwitchSession('study', nextStudyTime)
      setHasBreakStarted(false) // reset for next break
    }
  }, [hasBreakStarted, remainingTime])
  const handleFinish = () => {
    handleFinishSession()
    navigate('/')
  }

  const handleBreak = (time: number) => {
    handleSwitchSession('break', time)
  }

  const isRunning = user?.session?.status === 'running'

  return (
    <div>
      {user?.session?.type === 'study' ? (
        <StudyTimer
          remainingTime={remainingTime}
          elapsedTime={elapsedTime}
          isRunning={isRunning}
          breakTimeChoices={[...breakTimeChoices]}
          onStop={handleStopSession}
          onRestart={handleRestartSession}
          onFinish={handleFinish}
          onBreak={handleBreak}
        />
      ) : (
        <BreakTimer
          remainingTime={remainingTime}
          nextStudyTime={nextStudyTime}
          nextStudyTimeChoices={[...studyTimeChoices]}
          setNextStudyTime={setNextStudyTime}
        />
      )}
      <Btn
        variant="text"
        onClick={handleFinish}
        sx={{ position: 'fixed', top: 0, right: 0 }}
      >
        <span>終了</span>
      </Btn>
    </div>
  )
}

export default SessionTimer
