import React from 'react'
import TodayDisplay from '../../features/home/components/TodayDisplay'
import StartPanel from '../../features/home/components/StartPanel'
import TodayStudyPanel from '../../features/home/components/TodayStudyPanel'
import { Stack } from '@mui/material'
import ActiveUserPanel from '../../features/home/components/ActiveUserPanel'
import AppBarLayout from '../../features/appBar/components/AppBarLayout'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Popup from '../molecules/Popup'
import SessionResult from '../../features/session/components/stats/SessionResult'
import ProgressionMap from '../../features/home/components/progressionMap/ProgressionMap'
import Quickstart from '../../features/home/components/quickstart/Quickstart'
import useSessionService from '../../hooks/services/useSessionService'
import { MINUTES_IN_MS } from '../../constants/datetime-constants'

interface HomeScreenLayoutProps {}

const HomeScreenLayout: React.FC<HomeScreenLayoutProps> = ({}) => {
  const navigate = useNavigate()
  const [searchPrams, _setSearchPrams] = useSearchParams()
  const { onStartSession } = useSessionService()

  const handleQuickStart = (duration: number) => {
    onStartSession('study', duration)
    navigate('/session')
  }

  return (
    <>
      <AppBarLayout />
      <Stack spacing={3} mt={10}>
        <Quickstart
          onQuickstartClick={(min) => handleQuickStart(min * MINUTES_IN_MS)}
        />
        <ProgressionMap />

        <TodayDisplay />
        <TodayStudyPanel />
        <StartPanel />
        <ActiveUserPanel />
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
