import React from 'react'
import ActiveUserCard from '../molecules/ActiveUserCard'
import { Stack, Typography } from '@mui/material'
import ContainerCard from '../atoms/ContainerCard'

interface ActiveUserPanelProps {}

const sampleActiveUsers = [
  {
    iconUrl: 'https://i.pravatar.cc/150?img=1',
    userName: '田中',
    stateLabel: '勉強中',
    timerMs: 534000, // 1時間29分
    subjectLabel: '物理',
    subjectColor: '#61dafb',
  },
  {
    iconUrl: 'https://i.pravatar.cc/150?img=2',
    userName: '山田',
    stateLabel: '勉強中',
    timerMs: 320000, // 5分20秒
    subjectLabel: '国語',
    subjectColor: '#e91e63',
  },
  {
    iconUrl: 'https://i.pravatar.cc/150?img=3',
    userName: '鈴木',
    stateLabel: '休憩中',
    timerMs: 1200000, // 20分
    subjectLabel: '数学',
    subjectColor: '#3178c6',
  },
  {
    iconUrl: 'https://i.pravatar.cc/150?img=4',
    userName: '佐藤',
    stateLabel: '勉強中',
    timerMs: 890000, // 約2.5時間
    subjectLabel: '英語',
    subjectColor: '#9c27b0',
  },
]

const ActiveUserPanel: React.FC<ActiveUserPanelProps> = ({}) => {
  return (
    <ContainerCard>
      <Stack direction="row" spacing={2} mb={2} alignItems="end">
        <Typography variant="h6" fontWeight={600}>
          活動中クラスメイト
        </Typography>
        <Typography variant="h5" fontWeight={600}>
          25人
        </Typography>
      </Stack>
      <Stack direction="row">
        {sampleActiveUsers.map((user) => (
          <ActiveUserCard
            key={user.userName}
            iconUrl={user.iconUrl}
            userName={user.userName}
            stateLabel={user.stateLabel}
            timerMs={user.timerMs}
            subjectLabel={user.subjectLabel}
            subjectColor={user.subjectColor}
          />
        ))}
      </Stack>
    </ContainerCard>
  )
}

export default ActiveUserPanel
