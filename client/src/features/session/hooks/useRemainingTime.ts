import { useEffect, useRef, useState } from 'react'
import { convertToMilliseconds } from '../../../functions/dateTime-utils/time-conversion'
import { useCurrentUserStore } from '../../../stores/user/currentUserStore'

const useRemainingTime = () => {
  const { user } = useCurrentUserStore()
  const session = user?.session
  const [diffTime, setDiffTime] = useState(0)
  const remainingTimeRef = useRef<number>(Infinity)

  // 残り時間を計算
  const calcRemainingTime = (): number => {
    if (!session) return 0

    if (session.status === 'running') {
      return diffTime
    } else {
      const stoppedAt = convertToMilliseconds(session.stoppedAt || 0)
      const expectedEndAt = convertToMilliseconds(session.expectedEndAt || 0)
      return expectedEndAt - stoppedAt
    }
  }

  const remainingTime = calcRemainingTime()
  remainingTimeRef.current = remainingTime

  // 経過時間を計算
  const elapsedTime = (session?.expectedDuration ?? 0) - remainingTime

  // インターバルで diffTime を更新
  useEffect(() => {
    const endTimestamp = session?.expectedEndAt
    if (!endTimestamp) return

    const endTimeMs = convertToMilliseconds(endTimestamp)

    const updateRemainingTime = () => {
      const now = Date.now()
      const diff = endTimeMs - now
      setDiffTime(diff)
      remainingTimeRef.current = diff
    }

    updateRemainingTime()
    const interval = setInterval(updateRemainingTime, 1000)

    return () => clearInterval(interval)
  }, [session?.expectedEndAt])

  return {
    remainingTime,
    elapsedTime,
    remainingTimeRef,
  }
}

export default useRemainingTime
