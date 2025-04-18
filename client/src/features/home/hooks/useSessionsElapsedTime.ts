import { useEffect, useState } from 'react'
import { UserSession } from '../../../types/firebase/firestore-documents/users/user-document'
import { convertToMilliseconds } from '../../../functions/dateTime-utils/time-conversion'

export interface SessionTimerInfo {
  elapsedTime: number
  remainingTime: number
  expectedDuration: number
  totalSinceStarted: number
  startedAt: number
  inSession: boolean
}

type SessionsTimerInfoMap = Record<string, SessionTimerInfo>
type SessionMap = Record<string, UserSession | null>

const useSessionsTimerInfo = (sessions: SessionMap): SessionsTimerInfoMap => {
  const [infoMap, setInfoMap] = useState<SessionsTimerInfoMap>({})

  useEffect(() => {
    const computeInfo = (session: UserSession | null): SessionTimerInfo => {
      if (!session) {
        return {
          elapsedTime: 0,
          remainingTime: 0,
          expectedDuration: 0,
          totalSinceStarted: 0,
          startedAt: 0,
          inSession: false,
        }
      }

      const now = Date.now()
      const startedAt = convertToMilliseconds(session.startedAt)
      const latestStartedAt = convertToMilliseconds(session.latestStartedAt)
      const expectedDuration = session.expectedDuration
      const elapsed = session.elapsedDuration || 0

      const elapsedTime =
        session.status === 'running'
          ? elapsed + (now - latestStartedAt)
          : elapsed

      const remainingTime = Math.max(expectedDuration - elapsedTime, 0)
      const totalSinceStarted = now - startedAt

      return {
        elapsedTime,
        remainingTime,
        expectedDuration,
        totalSinceStarted,
        startedAt,
        inSession: true,
      }
    }

    const updateAllInfo = () => {
      const updated: SessionsTimerInfoMap = {}
      for (const key in sessions) {
        updated[key] = computeInfo(sessions[key])
      }
      setInfoMap(updated)
    }

    updateAllInfo()
    const intervalId = setInterval(updateAllInfo, 1000)

    return () => clearInterval(intervalId)
  }, [sessions])

  return infoMap
}

export default useSessionsTimerInfo
