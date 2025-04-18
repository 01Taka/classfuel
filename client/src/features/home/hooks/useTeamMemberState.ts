import { blue, green, grey, purple } from '@mui/material/colors'
import { UserSession } from '../../../types/firebase/firestore-documents/users/user-document'

export type TeamMemberState = 'offline' | 'away' | 'study' | 'break'

const useTeamMemberState = () => {
  const getState = (session: UserSession | null): TeamMemberState => {
    if (!session) return 'offline'
    if (session.status === 'stopped') {
      return 'away'
    }
    return session.type
  }

  const getStateLabel = (session: UserSession | null) => {
    const state = getState(session)
    switch (state) {
      case 'offline':
        return 'オフライン'
      case 'away':
        return '離席中'
      case 'study':
        return '勉強中'
      case 'break':
        return '休憩中'
    }
  }

  const getStateColor = (session: UserSession | null) => {
    const state = getState(session)
    switch (state) {
      case 'offline':
        return grey['300']
      case 'away':
        return purple['100']
      case 'study':
        return blue['100']
      case 'break':
        return green['100']
    }
  }

  return { getState, getStateLabel, getStateColor }
}

export default useTeamMemberState
