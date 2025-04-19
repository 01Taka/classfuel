// useSessionTimerController.ts
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUserStore } from '../../../stores/currentUserStore'
import useRemainingTime from '../hooks/useRemainingTime'
import useSessionService from '../hooks/useSessionService'
import FinishSE from '../../../assets/sounds/timer.mp3'

const useSessionTimerController = () => {
  const navigate = useNavigate()
  const { user } = useCurrentUserStore()
  const session = user?.session ?? null

  const {
    handleStopSession,
    handleRestartSession,
    handleFinishSession,
    handleSwitchSession,
  } = useSessionService()
  const { remainingTime, elapsedTime, remainingTimeRef } = useRemainingTime()

  const [nextStudyTime, setNextStudyTime] = useState<number>(25 * 60 * 1000)
  const [hasBreakStarted, setHasBreakStarted] = useState(false)
  const [isPlaySound, setIsPlaySound] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startSoundInterval = () => {
    const audio = new Audio(FinishSE)
    audio.load()
    audioRef.current = audio

    intervalRef.current = setInterval(() => {
      const remainingTime = remainingTimeRef.current
      if (0 < remainingTime && remainingTime <= 1000) {
        audioRef.current?.play().catch((err) => {
          console.error('Audio play error:', err)
        })
      }
    }, 1000)
  }

  const handleToggleSound = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlaySound(e.target.checked)
    if (e.target.checked) {
      startSoundInterval()
    } else {
      stopSoundInterval()
    }
  }

  const stopSoundInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleFinish = () => {
    setHasBreakStarted(false)
    handleFinishSession()
    stopSoundInterval()
    navigate('/')
  }

  const handleBreak = (time: number) => {
    handleSwitchSession('break', time)
  }

  useEffect(() => {
    if (session?.type === 'break' && !hasBreakStarted) {
      setHasBreakStarted(true)
    }
  }, [session?.type])

  useEffect(() => {
    if (hasBreakStarted && remainingTime < 0) {
      handleSwitchSession('study', nextStudyTime)
      setHasBreakStarted(false)
    }
  }, [hasBreakStarted, remainingTime])

  const isRunning = session?.status === 'running'

  return {
    session,
    remainingTime,
    elapsedTime,
    isRunning,
    nextStudyTime,
    setNextStudyTime,
    isPlaySound,
    setIsPlaySound,
    handleFinish,
    handleStopSession,
    handleRestartSession,
    handleSwitchSession,
    handleBreak,
    handleToggleSound,
  }
}

export default useSessionTimerController
