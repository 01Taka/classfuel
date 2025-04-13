import { useEffect, useMemo, useState } from 'react'
import { convertToMilliseconds } from '../../../functions/dateTime-utils/time-conversion'
import { useCurrentUserStore } from '../../../stores/currentUserStore'

const useRemainingTime = () => {
  const { user } = useCurrentUserStore()
  const [diffTime, setDiffTime] = useState<number>(0)

  useEffect(() => {
    const endTimestamp = user?.session?.expectedEndAt
    if (!endTimestamp) return

    const endTimeMs = convertToMilliseconds(endTimestamp)

    const updateRemainingTime = () => {
      const now = Date.now()
      setDiffTime(endTimeMs - now)
    }

    updateRemainingTime()
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

  const elapsedTime = useMemo(
    () => (user?.session?.expectedDuration ?? 0) - remainingTime,
    [user?.session?.expectedDuration, remainingTime]
  )

  return { remainingTime, elapsedTime }
}

export default useRemainingTime
