// useSessionTimerController.ts
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUserStore } from '../../../stores/user/currentUserStore'
import useRemainingTime from '../hooks/useRemainingTime'
import FinishSE from '../../../assets/sounds/timer.mp3'
import useSessionService from '../../../hooks/services/useSessionService'

const useSessionTimerController = () => {
  const navigate = useNavigate()
  const { user } = useCurrentUserStore()
  const session = user?.session ?? null

  const { onStopSession, onRestartSession, onFinishSession, onSwitchSession } =
    useSessionService()
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
    onFinishSession()
    stopSoundInterval()
    navigate('/?modal=result')
  }

  const handleBreak = (time: number) => {
    onSwitchSession('break', time)
  }

  useEffect(() => {
    if (session?.type === 'break' && !hasBreakStarted) {
      setHasBreakStarted(true)
    }
  }, [session?.type])

  useEffect(() => {
    if (hasBreakStarted && remainingTime < 0) {
      onSwitchSession('study', nextStudyTime)
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
    onStopSession,
    onRestartSession,
    setIsPlaySound,
    handleFinish,
    handleBreak,
    handleToggleSound,
  }
}

export default useSessionTimerController
