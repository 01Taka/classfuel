import React from 'react'
import { Stack } from '@mui/material'
import AppBarLayout from '../../features/appBar/components/AppBarLayout'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Popup from '../molecules/Popup'
import SessionResult from '../../features/session/components/stats/SessionResult'
import ProgressionMap from '../../features/home/components/progressionMap/ProgressionMap'
import Quickstart from '../../features/home/components/quickstart/Quickstart'
import useSessionService from '../../hooks/services/useSessionService'
import { MINUTES_IN_MS } from '../../constants/datetime-constants'
import { useCurrentUserStore } from '../../stores/user/currentUserStore'
import { useUserReportStore } from '../../stores/user/userReportStore'
import { MS_PER_STEP } from '../../constants/main-constants'

interface HomeScreenLayoutProps {}

const HomeScreenLayout: React.FC<HomeScreenLayoutProps> = ({}) => {
  const navigate = useNavigate()
  const [searchPrams, _setSearchPrams] = useSearchParams()
  const { user } = useCurrentUserStore()
  const { todayReport } = useUserReportStore()
  const { onStartSession } = useSessionService()

  const handleQuickStart = (duration: number) => {
    onStartSession('study', duration)
    navigate('/session')
  }

  const stepsAdvancedToday = Math.floor(
    (todayReport?.studyTime ?? 0) / MS_PER_STEP
  )
  const totalStepsAdvanced = Math.floor(
    (user?.status?.totalStudyDuration ?? 0) / MS_PER_STEP
  )

  return (
    <>
      <AppBarLayout />
      <Stack spacing={3} mt={10}>
        <Quickstart
          onQuickstartClick={(min) => handleQuickStart(min * MINUTES_IN_MS)}
        />
        <ProgressionMap
          todayStudyTimeMs={todayReport?.studyTime ?? 0}
          stepsAdvancedToday={stepsAdvancedToday}
          totalAdvanceNumber={totalStepsAdvanced}
        />
        {/* 
        <TodayDisplay />
        <TodayStudyPanel />
        <StartPanel />
        <ActiveUserPanel /> */}
      </Stack>
      <Popup
        open={searchPrams.get('modal') === 'result'}
        onClose={() => navigate('/')}
      >
        <SessionResult />
      </Popup>
    </>
  )
}

export default HomeScreenLayout
