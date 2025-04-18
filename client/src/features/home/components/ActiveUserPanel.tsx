import React, { useMemo } from 'react'
import ActiveUserCard from './ActiveUserCard'
import { IconButton, Stack, Typography } from '@mui/material'
import ContainerCard from '../../../components/atoms/ContainerCard'
import useActiveTeamMembers from '../hooks/useActiveTeamMembers'
import useSessionsElapsedTime, {
  SessionTimerInfo,
} from '../hooks/useSessionsElapsedTime'
import { MINUTES_IN_MILLISECOND } from '../../../constants/datetime-constants'
import useTeamMemberState from '../hooks/useTeamMemberState'
import { ArrowRight } from '@mui/icons-material'

interface ActiveUserPanelProps {}

const ActiveUserPanel: React.FC<ActiveUserPanelProps> = ({}) => {
  const { members } = useActiveTeamMembers()
  const { getStateLabel, getStateColor } = useTeamMemberState()

  // メンバーから自分自身を抜く処理を追加

  const sessions = useMemo(
    () =>
      Object.fromEntries(
        members.map((member) => [member.docId, member.session])
      ),
    [members]
  )
  const timerInfoMap = useSessionsElapsedTime(sessions)

  const activeMemberCount = useMemo(
    () => members.map((member) => member.session).filter(Boolean).length,
    [members]
  )

  const getTimerText = (timerInfo: SessionTimerInfo | null): string => {
    if (!timerInfo?.inSession) return ''
    const formatTime = (time: number) =>
      Math.floor(time / MINUTES_IN_MILLISECOND)

    const elapsedMin = formatTime(timerInfo.elapsedTime)
    const remainingMin = formatTime(timerInfo.remainingTime)
    const expectedMin = formatTime(timerInfo.expectedDuration)

    return timerInfo.remainingTime < 0
      ? `${elapsedMin}分経過`
      : `${remainingMin}/${expectedMin}(分)`
  }

  return (
    <ContainerCard sx={{ position: 'relative' }}>
      <Stack direction="row" spacing={2} mb={2} alignItems="end">
        <Typography variant="h6" fontWeight={600}>
          活動中クラスメイト
        </Typography>
        <Typography variant="h5" fontWeight={600}>
          {activeMemberCount}人
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-around" width="100%">
        {[...members].slice(0, 3).map((user) => (
          <ActiveUserCard
            key={user.docId}
            iconUrl={user.iconUrl}
            userName={user.displayName}
            stateLabel={getStateLabel(user.session)}
            cardColor={getStateColor(user.session)}
            timerText={getTimerText(timerInfoMap[user.docId] ?? null)}
            subjectLabel={''}
            subjectColor={''}
          />
        ))}
      </Stack>
      <IconButton sx={{ position: 'absolute', top: 2, right: 2 }}>
        <ArrowRight />
      </IconButton>
    </ContainerCard>
  )
}

export default ActiveUserPanel
