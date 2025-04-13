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
import FinishSE from '../../../assets/sounds/timer.mp3'

interface SessionTimerProps {}

const SessionTimer: React.FC<SessionTimerProps> = ({}) => {
  const navigate = useNavigate()
  const { user } = useCurrentUserStore()
  const session = user?.session ?? null

  const {
    handleStopSession,
    handleRestartSession,
    handleFinishSession,
    handleSwitchSession,
  } = useSessionService()
  const { remainingTime, elapsedTime } = useRemainingTime()

  const [nextStudyTime, setNextStudyTime] = useState<number>(25 * 60 * 1000)

  const [hasPlayedSE, setHasPlayedSE] = useState(false)
  const [hasBreakStarted, setHasBreakStarted] = useState(false)

  const playSE = () => {
    const audio = new Audio(FinishSE)
    audio.play()
  }

  useEffect(() => {
    // breakに切り替わった瞬間だけで1回だけtrueに
    if (session?.type === 'break' && !hasBreakStarted) {
      setHasBreakStarted(true)
    }
  }, [session?.type])

  useEffect(() => {
    // breakが始まってから、残り時間がマイナスになったらstudyに切り替え
    if (hasBreakStarted && remainingTime < 0) {
      playSE()
      handleSwitchSession('study', nextStudyTime)
      setHasPlayedSE(false) // reset for next sound effect
      setHasBreakStarted(false) // reset for next break
    }
  }, [hasBreakStarted, remainingTime])

  const handleFinish = () => {
    setHasPlayedSE(false)
    setHasBreakStarted(false)
    handleFinishSession()
    navigate('/')
  }

  useEffect(() => {
    if (remainingTime < 0 && session?.type === 'study' && !hasPlayedSE) {
      playSE()
      setHasPlayedSE(true)
    }
  }, [remainingTime, session?.type])

  const handleBreak = (time: number) => {
    handleSwitchSession('break', time)
  }

  const isRunning = session?.status === 'running'

  return (
    <div>
      {session?.type === 'study' ? (
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
